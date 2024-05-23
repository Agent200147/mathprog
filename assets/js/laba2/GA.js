onmessage = function(e) {
    importScripts('../../lib/Math.js')

    const borders = e.data[0]
    const strV = e.data[1]

    const fnInput = e.data[2]

    const k = e.data[3]
    const k2 = e.data[4]
    let n = e.data[5]
    const p = e.data[6]
    const flagIter = e.data[7]
    const flagEps = e.data[8]
    const flagEps2 = e.data[9]
    let eps = e.data[10]


    const start = e.data[11]

    if(!flagIter){
        n = 1000
    }

    if(flagEps2){
        eps = 2*(10**(-324))
    }

    let fprev
    let Pprev

    const random = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    const fn = (f, str,  ...variables) => {
        let scope = {}
        for (let i = 0; i < str.length; i++) {
            scope[str[i]] = variables[i]
        }

        return math.evaluate(f, scope)
    }

    const generateNullArr = (size) => {
        const arr = []
        for (let i = 0; i < size; i++) {
            arr[i] = 0
        }
        return arr
    }

    const functionGA = () => {
        const pop = generateNullArr(k)
        const popChild = generateNullArr(k2)

        let probParent = generateNullArr(k)
        const Fpop = generateNullArr(k)

        let parent1i
        let parent2i
        let chanceParent1
        let chanceParent2

        // #создание начальной популяции случайным образом
        for(let i = 0; i < k; i++){
            pop[i] = generateNullArr(borders.length)
            borders.forEach((border) => {
                pop[i].push(random(border.left, border.right))

            })
            Fpop[i] = fn(fnInput, strV, ...pop[i])
        }



        // #эволюция популяции в k поколениях
        for (let i = 0; i < n; i++) {
            // #расчет вероятности стать родителем для каждой особи (оператор отбора)
            // #чем меньше значение функции, тем больше вероятность стать родителем
            probParent = generateNullArr(k)

            fprev = pop[0][borders.length]

            for (let j = 0; j < k; j++) {
                probParent[j] = (math.max(Fpop) - Fpop[j] + 1) / (k * (math.max(Fpop) + 1) - math.sum(Fpop))
                // probParent[j] = (math.max(Fpop) - Fpop[j] + 1) / (k * (math.max(Fpop) + 1) - math.sum(Fpop))
            }

            // #создание потомков
            for (let j = 0; j < k2; j++) {
                // #определение первого родителя
                chanceParent1 = math.random(0, 1)
                for (let l = 0; l < k; l++) {
                    if (chanceParent1 < probParent[l]) {
                        parent1i = l
                        break
                    } else{
                        chanceParent1 -= probParent[l]
                    }
                }

                // #определение второго родителя
                chanceParent2 = math.random(0, 1)
                for (let l = 0; l < k; l++) {
                    if (chanceParent2 < probParent[l]) {
                        parent2i = l
                        break
                    } else{
                        chanceParent2 -= probParent[l]
                    }
                }

                // #определение генов потомка(оператор скрещивания)
                popChild[j] = generateNullArr(borders.length + 1)
                for (let l = 0; l < borders.length; l++) {
                    if (math.random(0, 1) < 0.5) {
                        // #наследование гена от первого родителя
                        popChild[j][l] = pop[parent1i][l]
                    }
                    else {
                        // #наследование гена от второго родителя
                        popChild[j][l] = pop[parent2i][l]
                    }

                    if(math.random(0, 1) <= p){
                        // #мутация гена
                        // #при мутации ген отклоняется на случайное число не больше 0.1 (влево или вправо)
                        popChild[j][l] += math.random(-0.1, 0.1)

                        // #проверка границ (чтобы не выйти из начальных ограничений)
                        if(popChild[j][l] < borders[l].left){
                            popChild[j][l] = borders[l].left

                        }
                        if(popChild[j][l] > borders[l].right){
                            popChild[j][l] = borders[l].right
                        }
                    }
                }

                // popChild[j] = onePoint3(pop[parent1i][0], pop[parent2i][1])

                // #вычисление значения функции в полученной точке-потомке
                popChild[j][borders.length] = fn(fnInput, strV, ...popChild[j]);
            }

            // #отбор следующего поколения (количество-размер начальной популяции)
            // #сортируем по минимизации функции и берем первые _ меньшие
            popChild.sort((a, b) => a[borders.length] - b[borders.length])
            for (let j = 0; j < k; j++) {
                pop[j] = popChild[j]
                Fpop[j] = popChild[j][borders.length]
            }


            if(i !== 0 && flagEps){
                if(Math.abs(pop[0][borders.length] - fprev) <= eps){
                    break
                }
            }

            postMessage(`translateY(${ -(i / n * 226)}px)`)

            // #пересчет значений функции начальной популяции в следующем поколении
        }

        const xMin = pop[0][0]
        const yMin = pop[0][1]
        const f = pop[0][borders.length]

        const variablesMin = [...pop[0]]
        variablesMin.pop()

        const end = new Date().getTime()
        const time = (end - start) / 1000

        let result = []
        for (let i = 0; i < strV.length; i++) {
            result.push(`${strV[i]}Min = <strong> ${variablesMin[i].toFixed(5)}</strong>`)
        }
        result.push(`F = <strong> ${f.toFixed(5)}</strong>`)
        result.push(`Время: <strong>${time}</strong>с`)

        // return [pop, Pprev, f , fprev]
        // return result = ["xMin = <strong>" + xMin.toFixed(5) + "</strong>",
        //     "yMin = <strong>" + yMin.toFixed(5) + "</strong>",
        //     "F = <strong>" + f.toFixed(5) + "</strong>",
        //     `Время: <strong>${time}</strong>с`]

        return result
    }

    // mkf(leftBorder, rightBorder, fnInput, N, start)

    // const workerResult = mkf(leftBorder, rightBorder, fnInput, N, start)
    postMessage(functionGA())
}
