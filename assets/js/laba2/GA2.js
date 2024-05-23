onmessage = function(e) {
    importScripts('../../lib/Math.js')

    const leftBorderX = e.data[0]
    const rightBorderX = e.data[1]

    const leftBorderY = e.data[2]
    const rightBorderY = e.data[3]

    const fnInput = e.data[4]

    const k = e.data[5]
    const k2 = e.data[6]
    let n = e.data[7]
    const p = e.data[8]
    const flagIter = e.data[9]
    const flagEps = e.data[10]
    const flagEps2 = e.data[11]
    let eps = e.data[12]


    const start = e.data[13]

    if(!flagIter){
        n = 1000000
    }

    if(flagEps2){
        eps = 2*(10**(-324))
    }

    let fprev
    let Pprev

    const random = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    const fn = (x, y, f) => {
        let scope = {
            x: x,
            y: y
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

    function onePoint2(x,y) {
        let arg1 = x;
        let arg2 = y;
        let points = [ ];
        // let a1 = Number(arg1).toString(2);
        // let a2 = Number(arg2).toString(2);

        let max_len = 8;
        let a1 = x.padStart(max_len, "0");
        let a2 = y.padStart(max_len, "0");
        let bp = math.round(math.random(1, max_len));
        let b1 = a1.substring(0, bp) + a2.substring(bp);
        let b2 = a2.substring(0, bp) + a1.substring(bp);

        let arr1 = [parseInt(b1, 2)/256, (parseInt(b1, 2)+20)/256]
        let arr2 = [parseInt(b2, 2)/256, (parseInt(b2, 2)+20)/256]


        points[0] = b1
        points[1] = b2
        // points[0] = parseInt(b1, 2);



        // points[1] = parseInt(b2, 2);
        return points;
    }
    // const fromBinaryD = (n, a, b) => a + (parseInt(n, 2)/256 + (parseInt(n, 2)+(b-a))/256)/2*(b-a)
    const fromBinaryD = (n, a, b) => a + ((parseInt(n, 2)/256 + (parseInt(n, 2)+1)/256)/2*(b-a))

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
            pop[i] = generateNullArr(2)
            pop[i][0] = math.random(leftBorderX, rightBorderX)
            pop[i][1] = math.random(leftBorderY, rightBorderY)

            Fpop[i] = fn(pop[i][0], pop[i][1], fnInput)

            pop[i][0] = pop[i][0].toString(2).padStart(8, "0")
            pop[i][1] = pop[i][1].toString(2).padStart(8, "0")
        }



        // #эволюция популяции в k поколениях
        for (let i = 0; i < n; i++) {
            // #расчет вероятности стать родителем для каждой особи (оператор отбора)
            // #чем меньше значение функции, тем больше вероятность стать родителем
            probParent = generateNullArr(k)

            fprev = pop[0][2]

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
                popChild[j] = generateNullArr(3)
                // for (let l = 0; l < 2; l++) {
                //     if (math.random(0, 1) < 0.5) {
                //         // #наследование гена от первого родителя
                //         popChild[j][l] = pop[parent1i][l]
                //     }
                //     else {
                //         // #наследование гена от второго родителя
                //         popChild[j][l] = pop[parent2i][l]
                //     }
                //
                //     if(math.random(0, 1) <= p){
                //         // #мутация гена
                //         // #при мутации ген отклоняется на случайное число не больше 0.1 (влево или вправо)
                //         popChild[j][l] += math.random(-0.1, 0.1)
                //
                //         // #проверка границ (чтобы не выйти из начальных ограничений)
                //         if(popChild[j][l] < leftBorderX){
                //             popChild[j][l] = leftBorderX
                //
                //         }
                //         if(popChild[j][l] > rightBorderX){
                //             popChild[j][l] = rightBorderX
                //         }
                //     }
                // }



                popChild[j] = onePoint2(pop[parent1i][0], pop[parent2i][1])

                // #вычисление значения функции в полученной точке-потомке
                popChild[j][2] = fn(fromBinaryD(popChild[j][0], leftBorderX, rightBorderX), fromBinaryD(popChild[j][1], leftBorderY, rightBorderY), fnInput);
            }

            // #отбор следующего поколения (количество-размер начальной популяции)
            // #сортируем по минимизации функции и берем первые _ меньшие
            popChild.sort((a, b) => a[2] - b[2])
            for (let j = 0; j < k; j++) {
                pop[j] = popChild[j]
                Fpop[j] = popChild[j][2]
            }


            if(i !== 0 && flagEps){
                if(Math.abs(pop[0][2] - fprev) <= eps){
                    break
                }
            }

            postMessage(`translateY(${ -(i / n * 226)}px)`)

            // #пересчет значений функции начальной популяции в следующем поколении
        }

        const xMin = fromBinaryD(pop[0][0], leftBorderX, rightBorderX)
        const yMin = fromBinaryD(pop[0][1], leftBorderY, rightBorderY)
        const f = pop[0][2]


        const end = new Date().getTime()
        const time = (end - start) / 1000
        // return [pop, '1', '1' , '1']
        return result = ["xMin = <strong>" + xMin.toFixed(5) + "</strong>",
            "yMin = <strong>" + yMin.toFixed(5) + "</strong>",
            "F = <strong>" + f.toFixed(5) + "</strong>",
            `Время: <strong>${time}</strong>с`]
    }

    // mkf(leftBorder, rightBorder, fnInput, N, start)

    // const workerResult = mkf(leftBorder, rightBorder, fnInput, N, start)
    postMessage(functionGA())
}
