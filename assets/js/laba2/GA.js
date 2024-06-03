import { create, all } from 'mathjs'
import { fn, generateNullArr, random } from "../utils/index.js";

const math = create(all)

onmessage = function(e) {
    const [borders, variablesArr, fnInput, k, k2, N, p, flagIter, flagEps, flagMachineEps, EPS] = e.data

    let n = N
    let eps = EPS

    if(!flagIter){
        n = 1000
    }

    if(flagMachineEps){
        eps = 2*(10**(-324))
    }

    let fprev

    const functionGA = () => {
        const start = new Date().getTime()

        const pop = generateNullArr(k)
        const popChild = generateNullArr(k2)

        let probParent = generateNullArr(k)
        const Fpop = generateNullArr(k)

        let parent1i
        let parent2i
        let chanceParent1
        let chanceParent2

        // Создание начальной популяции случайным образом
        for(let i = 0; i < k; i++){
            pop[i] = generateNullArr(borders.length)
            borders.forEach((border) => {
                pop[i].push(random(border.left, border.right))

            })
            Fpop[i] = fn(fnInput, variablesArr, ...pop[i])
        }

        // #эволюция популяции в k поколениях
        for (let i = 0; i < n; i++) {
            // Расчет вероятности стать родителем для каждой особи (оператор отбора)
            // Чем меньше значение функции, тем больше вероятность стать родителем
            probParent = generateNullArr(k)

            fprev = pop[0][borders.length]

            for (let j = 0; j < k; j++) {
                probParent[j] = (math.max(Fpop) - Fpop[j] + 1) / (k * (math.max(Fpop) + 1) - math.sum(Fpop))
            }

            // Создание потомков
            for (let j = 0; j < k2; j++) {
                // Определение первого родителя
                chanceParent1 = math.random(0, 1)
                for (let l = 0; l < k; l++) {
                    if (chanceParent1 < probParent[l]) {
                        parent1i = l
                        break
                    } else{
                        chanceParent1 -= probParent[l]
                    }
                }

                // Определение второго родителя
                chanceParent2 = math.random(0, 1)
                for (let l = 0; l < k; l++) {
                    if (chanceParent2 < probParent[l]) {
                        parent2i = l
                        break
                    } else{
                        chanceParent2 -= probParent[l]
                    }
                }

                // Определение генов потомка(оператор скрещивания)
                popChild[j] = generateNullArr(borders.length + 1)
                for (let l = 0; l < borders.length; l++) {
                    if (math.random(0, 1) < 0.5) {
                        // Наследование гена от первого родителя
                        popChild[j][l] = pop[parent1i][l]
                    }
                    else {
                        // Наследование гена от второго родителя
                        popChild[j][l] = pop[parent2i][l]
                    }

                    if(math.random(0, 1) <= p){
                        // Мутация гена
                        // При мутации ген отклоняется на случайное число не больше 0.1 (влево или вправо)
                        popChild[j][l] += math.random(-0.1, 0.1)

                        // Проверка границ (чтобы не выйти из начальных ограничений)
                        if(popChild[j][l] < borders[l].left){
                            popChild[j][l] = borders[l].left

                        }
                        if(popChild[j][l] > borders[l].right){
                            popChild[j][l] = borders[l].right
                        }
                    }
                }

                // Вычисление значения функции в полученной точке-потомке
                popChild[j][borders.length] = fn(fnInput, variablesArr, ...popChild[j]);
            }

            // Отбор следующего поколения (количество-размер начальной популяции)
            // Сортируем по минимизации функции и берем первые _ меньшие
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

            // postMessage(`translateY(${ -(i / n * 226)}px)`)
            postMessage(i / n * 100)
        }

        const f = pop[0][borders.length]

        const variablesMin = [...pop[0]]
        variablesMin.pop()

        const end = new Date().getTime()
        const time = (end - start) / 1000

        let result = []
        for (let i = 0; i < variablesArr.length; i++) {
            result.push(`${variablesArr[i]}Min = <strong> ${variablesMin[i].toFixed(5)}</strong>`)
        }
        result.push(`F = <strong> ${f.toFixed(5)}</strong>`)
        result.push(`Время: <strong>${time}</strong>с`)

        postMessage(result)
    }

    functionGA()
}
