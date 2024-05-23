"use strict";

// import {isNumeric} from "mathjs";
// import {min, max} from 'mathjs'

window.addEventListener('load', () => {
    // importScripts('../lib/Math.js')
    const menu = document.querySelector('.menu')
    const menuItems = document.querySelectorAll('.menu__item')
    const wrapper = document.querySelector('.wrapper')

    Object.prototype.show = function() {this.style.display = 'flex'}
    Object.prototype.hide = function() {this.style.display = 'none'}


    menuItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            menu.classList.remove('firstTab', 'secondTab', 'thirdTab')
            wrapper.classList.remove('firstTab', 'secondTab', 'thirdTab')

            menu.classList.add(item.dataset.link)
            wrapper.classList.add(item.dataset.link)

            // currentPage = item.dataset.link
            // localStorage.setItem('currentPage', currentPage)
            //
            // currentPage === 'firstTab' ? FirstPage() : ""
            // currentPage === 'secondTab' ? SecondPage() : ""
            // currentPage === 'thirdTab' ? ThirdPage() : ""
            //
            // cl(currentPage)
        })
    })

    const methodsWrapper = document.querySelector('.methods')
    const methodsBoolean = []

    const methodsFlags = document.querySelectorAll('.methodFlag')
    methodsFlags.forEach((item, index) => {
        item.addEventListener('input', (e) => {
            if (e.target.checked) {
                methodsWrapper.classList.add(item.id)
            }
            else{
                methodsWrapper.classList.remove(item.id)
            }
            methodsBoolean[index] = e.target.checked
            console.log(methodsBoolean)
        })
    })

    methodsFlags.forEach((item, index) => {
        if (item.checked) {
            methodsWrapper.classList.add(item.id)
        }
        else{
            methodsWrapper.classList.remove(item.id)
        }
        methodsBoolean[index] = item.checked

    })
    console.log(methodsBoolean)


    // 1 лабораторная
    const myWorkerMonte = new Worker("assets/js/laba1/MK.js");
    const myWorkerAnnealing = new Worker("assets/js/laba1/AN.js");

    const myWorkerGA = new Worker("assets/js/laba2/GA.js");

    const myWorkerIN = new Worker("assets/js/laba3/INTERVAL.js", { type: "module" });


    const form1 = document.getElementById('form1')

    const resultMonte = document.getElementById('resultMonte')
    const monteLoader = document.getElementById('monteLoader')

    const resultAnnealing = document.getElementById('resultAnnealing')
    const annealingLoader = document.getElementById('annealingLoader')

    const resultGA = document.getElementById('resultGA')


    const btnSubmit1 = document.getElementById('btnSubmit1')
    const btnReset1 = document.getElementById('btnReset1')
    // const btnStop = document.getElementById('btnStop')
    const btnClear1 = document.getElementById('btnClear1')

    let monteI = 1
    let annealingI = 1
    let GaI = 1
    let InI = 1


    btnReset1.addEventListener('click', () => {
        form1.reset()
    })

    btnClear1.addEventListener('click', () => {
        monteI = 1
        annealingI = 1
        GaI = 1
        InI = 1
        resultMonte.innerHTML = ''
        resultAnnealing.innerHTML = ''
    })


    // ГА
    const flagEps = document.getElementById('flagEps')
    const eps = document.getElementById('eps')

    const commonData2 = document.getElementById('commonData2')

    if (flagEps.checked) {
        eps.show()
        commonData2.style.height = '571px'
    }
    else{
        eps.hide()
        commonData2.style.height = '499px'
    }

    flagEps.addEventListener('input', (e) => {
        if (e.target.checked) {
            eps.show()
            commonData2.style.height = '571px'
        }
        else{
            eps.hide()
            commonData2.style.height = '499px'
        }
    })

    if (flagEps2.checked) {
        form1.eps.value = ''
        form1.eps.setAttribute('disabled', 'disabled')
    }
    else{
        form1.eps.removeAttribute('disabled')
    }

    flagEps2.addEventListener('input', (e) => {
        if (e.target.checked) {
            form1.eps.value = ''
            form1.eps.setAttribute('disabled', 'disabled')
        }
        else{
            form1.eps.removeAttribute('disabled')
        }
    })

    let inputsFn = document.querySelectorAll('input')

    inputsFn.forEach((item) => {
        item.addEventListener('dblclick', (e) => {
            if(!e.target.value && e.target.dataset.autocomplete){
                e.target.value = e.target.dataset.autocomplete
            }
        })
    })

    let strV
    form1.addEventListener('submit', (e) => {
        e.preventDefault()

        // btnStop.addEventListener('click', () => {
        //     myWorkerMonte.terminate()
        //     myWorkerMonte = new Worker("../assets/js/MK.js");
        //
        //     myWorkerAnnealing.terminate()
        //     myWorkerAnnealing = new Worker("../assets/js/AN.js");
        // })


        // const leftBorder = Number(form1.leftBorder.value)
        // const rightBorder = Number(form1.rightBorder.value)

        const leftBorders = document.querySelectorAll('.leftBorder')
        const rightBorders = document.querySelectorAll('.rightBorder')

        let borders = []
        for (let i = 0; i < leftBorders.length; i++) {
            borders.push({left: Number(leftBorders[i].value), right: Number(rightBorders[i].value)})
        }

        console.log(borders)

        const fnInput = form1.fnInput.value
        let value = fnInput.match(/[a-z\s]+/ig).join('')
        exception.forEach((item) => {
            value = value.replaceAll(item, '')
            value = value.replaceAll(' ', '')
        })
        let obj = value.split('').reduce((o, v, i) => { o[v] = v; return o; }, {});
        let arrUnique = Object.keys(obj);
        strV = arrUnique.join('')
        // const range = []
        // for (let i = 0; i < rightBorder - leftBorder; i++) {
        //     range[i] = leftBorder + i
        // }


        const start = new Date().getTime()


        // Монте-Карло
        if(methodsBoolean[0]){
            const N = form1.monteIteration.value

            resultMonte.innerHTML += `<div class=\"result result-monte main-block\"><h2>Результат ${monteI} Монте-Карло</h2><div class="main-block main-block-white main-block-monte-${monteI}">
        <div class="main-block-white-progress" id="progressMonte${monteI}"></div>
        <div class="loader" id="monteLoader${monteI}">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;"
                         width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                        <defs>
                            <path id="path" d="M50 15A15 35 0 0 1 50 85A15 35 0 0 1 50 15" fill="none"></path>
                            <path id="patha" d="M0 0A15 35 0 0 1 0 70A15 35 0 0 1 0 0" fill="none"></path>
                        </defs>
                        <g transform="rotate(0 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(60 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(120 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(0 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#e15b64">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="0s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                        <g transform="rotate(60 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#f8b26a">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="-0.08s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                        <g transform="rotate(120 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#abbd81">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="-0.1666s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                    </svg>
                </div>
        </div></div>`

            myWorkerMonte.postMessage([borders, strV, fnInput, N, start, monteI])
            btnSubmit1.setAttribute('disabled', 'disabled')
            btnClear1.setAttribute('disabled', 'disabled')

            console.log('Message posted to worker MK.js')

            myWorkerMonte.onmessage = function(e) {
                const progressBar = document.getElementById(`progressMonte${monteI}`)

                if(e.data.length !== (strV.length + 2)){
                    btnSubmit1.setAttribute('disabled', 'disabled')
                    btnClear1.setAttribute('disabled', 'disabled')
                    progressBar.style.transform = e.data
                    return false
                }
                progressBar.style.transform = 'translateY(226px)'
                const output = document.querySelector(`.main-block-monte-${monteI}`)
                const monteLoader = document.getElementById(`monteLoader${monteI}`)
                monteLoader.style.display = 'none'
                progressBar.style.display = 'none'


                // output.innerHTML = `<h2>Результат ${monteI}</h2>`
                // const output2 = document.createElement('div')
                // output2.classList.add('main-block', 'main-block-white')
                monteI++

                monteLoader.style.display = 'none'
                e.data.forEach((item) => {
                    output.innerHTML += `<div>${item}</div>`
                })

                btnSubmit1.removeAttribute('disabled')
                btnClear1.removeAttribute('disabled')

                // resultMonte.append(output)
            }
        }

        // Имитация отжига
        if(methodsBoolean[1]){
            const Tmax = form1.annealingT.value
            const r = form1.annealingR.value
            const L = form1.annealingL.value

        //     resultAnnealing.innerHTML += `<div class=\"result main-block\"><h2>Результат ${annealingI} Имитация отжига</h2><div class="main-block main-block-white main-block-annealing-${annealingI}">
        // <div class="main-block-white-progress anneal-progress" id="progressAnnealing${annealingI}"></div>
        // <div class="loader" id="annealingLoader${annealingI}">
        //             <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;"
        //                  width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        //                 <defs>
        //                     <path id="path" d="M50 15A15 35 0 0 1 50 85A15 35 0 0 1 50 15" fill="none"></path>
        //                     <path id="patha" d="M0 0A15 35 0 0 1 0 70A15 35 0 0 1 0 0" fill="none"></path>
        //                 </defs>
        //                 <g transform="rotate(0 50 50)">
        //                     <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
        //                 </g>
        //                 <g transform="rotate(60 50 50)">
        //                     <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
        //                 </g>
        //                 <g transform="rotate(120 50 50)">
        //                     <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
        //                 </g>
        //                 <g transform="rotate(0 50 50)">
        //                     <circle cx="50" cy="15" r="9" fill="#e15b64">
        //                         <animateMotion dur="0.5s" repeatCount="indefinite" begin="0s">
        //                             <mpath xlink:href="#patha"></mpath>
        //                         </animateMotion>
        //                     </circle>
        //                 </g>
        //                 <g transform="rotate(60 50 50)">
        //                     <circle cx="50" cy="15" r="9" fill="#f8b26a">
        //                         <animateMotion dur="0.5s" repeatCount="indefinite" begin="-0.08s">
        //                             <mpath xlink:href="#patha"></mpath>
        //                         </animateMotion>
        //                     </circle>
        //                 </g>
        //                 <g transform="rotate(120 50 50)">
        //                     <circle cx="50" cy="15" r="9" fill="#abbd81">
        //                         <animateMotion dur="0.5s" repeatCount="indefinite" begin="-0.1666s">
        //                             <mpath xlink:href="#patha"></mpath>
        //                         </animateMotion>
        //                     </circle>
        //                 </g>
        //             </svg>
        //         </div>
        // </div></div>`
            resultMonte.innerHTML += `<div class=\"result result-annealing main-block\"><h2>Результат ${annealingI} Имитация отжига</h2><div class="main-block main-block-white main-block-annealing-${annealingI}">
        <div class="main-block-white-progress anneal-progress" id="progressAnnealing${annealingI}"></div>
        <div class="loader" id="annealingLoader${annealingI}">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;"
                         width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                        <defs>
                            <path id="path" d="M50 15A15 35 0 0 1 50 85A15 35 0 0 1 50 15" fill="none"></path>
                            <path id="patha" d="M0 0A15 35 0 0 1 0 70A15 35 0 0 1 0 0" fill="none"></path>
                        </defs>
                        <g transform="rotate(0 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(60 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(120 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(0 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#e15b64">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="0s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                        <g transform="rotate(60 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#f8b26a">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="-0.08s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                        <g transform="rotate(120 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#abbd81">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="-0.1666s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                    </svg>
                </div>
        </div></div>`

            myWorkerAnnealing.postMessage([borders, strV, fnInput, L, Tmax, r, start])
            btnSubmit1.setAttribute('disabled', 'disabled')
            btnClear1.setAttribute('disabled', 'disabled')

            console.log('Message posted to worker AN.js')

            myWorkerAnnealing.onmessage = function(e) {
                const progressBar = document.getElementById(`progressAnnealing${annealingI}`)

                if(e.data.length !== strV.length + 2){
                    btnSubmit1.setAttribute('disabled', 'disabled')
                    btnClear1.setAttribute('disabled', 'disabled')
                    progressBar.style.transform = e.data
                    return false
                }
                progressBar.style.transform = 'translateY(226px)'
                const output = document.querySelector(`.main-block-annealing-${annealingI}`)
                const annealingLoader = document.getElementById(`annealingLoader${annealingI}`)
                annealingLoader.style.display = 'none'
                progressBar.style.display = 'none'

                annealingI++

                e.data.forEach((item) => {
                    output.innerHTML += `<div>${item}</div>`
                })
                btnSubmit1.removeAttribute('disabled')
                btnClear1.removeAttribute('disabled')
            }
        }

        // ГА
        if(methodsBoolean[2]){

            const k = form1.k.value
            const k2 = form1.k2.value
            const n = form1.n.value
            const p = form1.p.value

            const flagIter = form1.flagIter.checked
            const flagEps = form1.flagEps.checked
            const flagEps2 = form1.flagEps2.checked
            const epsInput = form1.eps.value
            const art = [k, k2, n, p, flagIter, flagEps, flagEps2, epsInput]
            console.log(art)

            if(!flagIter && !flagEps){
                alert('Выберите какой-либо критерий останова!')
                return false
            }

            if(!epsInput && !flagEps2 && flagEps){
                alert('Выберите точность!')
                return false
            }

            resultMonte.innerHTML += `<div class=\"result result-ga main-block\"><h2>Результат ${GaI} Генетический алг.</h2><div class="main-block main-block-white main-block-GA-${GaI}">
        <div class="main-block-white-progress" id="progressGA${GaI}"></div>
        <div class="loader" id="GaLoader${GaI}">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;"
                         width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                        <defs>
                            <path id="path" d="M50 15A15 35 0 0 1 50 85A15 35 0 0 1 50 15" fill="none"></path>
                            <path id="patha" d="M0 0A15 35 0 0 1 0 70A15 35 0 0 1 0 0" fill="none"></path>
                        </defs>
                        <g transform="rotate(0 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(60 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(120 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(0 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#e15b64">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="0s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                        <g transform="rotate(60 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#f8b26a">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="-0.08s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                        <g transform="rotate(120 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#abbd81">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="-0.1666s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                    </svg>
                </div>
        </div></div>`

            myWorkerGA.postMessage([borders, strV, fnInput, k, k2, n, p, flagIter, flagEps, flagEps2, epsInput, start])
            btnSubmit1.setAttribute('disabled', 'disabled')
            btnClear1.setAttribute('disabled', 'disabled')

            myWorkerGA.onmessage = function(e) {
                const progressBar = document.getElementById(`progressGA${GaI}`)

                if(e.data.length !== strV.length + 2){
                    btnSubmit1.setAttribute('disabled', 'disabled')
                    btnClear1.setAttribute('disabled', 'disabled')
                    progressBar.style.transform = e.data
                    return false
                }
                progressBar.style.transform = 'translateY(226px)'
                const output = document.querySelector(`.main-block-GA-${GaI}`)
                const GaLoader = document.getElementById(`GaLoader${GaI}`)
                GaLoader.style.display = 'none'
                progressBar.style.display = 'none'

                GaI++

                GaLoader.style.display = 'none'
                e.data.forEach((item) => {
                    output.innerHTML += `<div>${item}</div>`
                })

                console.log(e.data)
                btnSubmit1.removeAttribute('disabled')
                btnClear1.removeAttribute('disabled')

                // resultMonte.append(output)
            }
        }
        if(methodsBoolean[3]){
            // const k = form1.k.value
            // const k2 = form1.k2.value
            // const n = form1.n.value
            // const p = form1.p.value
            //
            // const flagIter = form1.flagIter.checked
            // const flagEps = form1.flagEps.checked
            // const flagEps2 = form1.flagEps2.checked

            const eps = form1.InEps.value
            // const art = [k, k2, n, p, flagIter, flagEps, flagEps2, epsInput]
            // console.log(art)

            // if(!flagIter && !flagEps){
            //     alert('Выберите какой-либо критерий останова!')
            //     return
            // }
            //
            // if(!epsInput && !flagEps2 && flagEps){
            //     alert('Выберите точность!')
            //     return
            // }

            resultMonte.innerHTML += `<div class=\"result result-interval main-block\"><h2>Результат ${InI} Интервальный алг.</h2><div class="main-block main-block-white main-block-IN-${InI}">
        <div class="main-block-white-progress" id="progressIN${InI}"></div>
        <div class="loader" id="InLoader${InI}">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;"
                         width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                        <defs>
                            <path id="path" d="M50 15A15 35 0 0 1 50 85A15 35 0 0 1 50 15" fill="none"></path>
                            <path id="patha" d="M0 0A15 35 0 0 1 0 70A15 35 0 0 1 0 0" fill="none"></path>
                        </defs>
                        <g transform="rotate(0 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(60 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(120 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(0 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#e15b64">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="0s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                        <g transform="rotate(60 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#f8b26a">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="-0.08s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                        <g transform="rotate(120 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#abbd81">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="-0.1666s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                    </svg>
                </div>
        </div></div>`

            myWorkerIN.postMessage([borders, strV, fnInput, eps, start])
            btnSubmit1.setAttribute('disabled', 'disabled')
            btnClear1.setAttribute('disabled', 'disabled')

            myWorkerIN.onmessage = function(e) {
                const progressBar = document.getElementById(`progressIN${InI}`)

                // if (e.data.length !== strV.length + 2) {
                //     btnSubmit1.setAttribute('disabled', 'disabled')
                //     btnClear1.setAttribute('disabled', 'disabled')
                //     progressBar.style.transform = e.data
                //     return false
                // }
                console.log(e.data)
                progressBar.style.transform = 'translateY(226px)'
                const output = document.querySelector(`.main-block-IN-${InI}`)
                const InLoader = document.getElementById(`InLoader${InI}`)
                InLoader.style.display = 'none'
                progressBar.style.display = 'none'

                InI++

                InLoader.style.display = 'none'
                e.data.forEach((item) => {
                    output.innerHTML += `<div>${item}</div>`
                })

                console.log(e.data)
                btnSubmit1.removeAttribute('disabled')
                btnClear1.removeAttribute('disabled')
            }
        }

        // monteLoader.style.display = 'block'
        // annealingLoader.style.display = 'block'
    })





    // ------------------------------------------------------------------------




    // 2 лабораторная
    //
    // const form2 = document.getElementById('form2')
    //
    // const btnSubmit2 = document.getElementById('btnSubmit2')
    // const btnReset2 = document.getElementById('btnReset2')
    // const btnClear2 = document.getElementById('btnClear2')
    //
    // const flagEps = document.getElementById('flagEps')
    // const eps = document.getElementById('eps')
    //
    // const commonData2 = document.getElementById('commonData2')
    //
    // if (flagEps.checked) {
    //     eps.show()
    //     commonData2.style.height = '571px'
    // }
    // else{
    //     eps.hide()
    //     commonData2.style.height = '499px'
    // }
    //
    // flagEps.addEventListener('input', (e) => {
    //     if (e.target.checked) {
    //         eps.show()
    //         commonData2.style.height = '571px'
    //     }
    //     else{
    //         eps.hide()
    //         commonData2.style.height = '499px'
    //     }
    // })
    //
    // if (flagEps2.checked) {
    //     form2.eps.value = ''
    //     form2.eps.setAttribute('disabled', 'disabled')
    // }
    // else{
    //     form2.eps.removeAttribute('disabled')
    // }
    //
    // flagEps2.addEventListener('input', (e) => {
    //     if (e.target.checked) {
    //         form2.eps.value = ''
    //         form2.eps.setAttribute('disabled', 'disabled')
    //     }
    //     else{
    //         form2.eps.removeAttribute('disabled')
    //     }
    // })
    //
    // let GaI = 1
    //
    // btnReset2.addEventListener('click', () => {
    //     form2.reset()
    // })
    //
    // btnClear2.addEventListener('click', () => {
    //     GaI = 1
    //     resultGA.innerHTML = ''
    // })
    //
    //
    // form2.addEventListener('submit', (e) => {
    //     e.preventDefault()
    //
    //     // btnStop.addEventListener('click', () => {
    //     //     myWorkerMonte.terminate()
    //     //     myWorkerMonte = new Worker("../assets/js/MK.js");
    //     //
    //     //     myWorkerAnnealing.terminate()
    //     //     myWorkerAnnealing = new Worker("../assets/js/AN.js");
    //     // })
    //
    //
    //     const leftBorderX = Number(form2.leftBorderX.value)
    //     const rightBorderX = Number(form2.rightBorderX.value)
    //
    //     const leftBorderY = Number(form2.leftBorderY.value)
    //     const rightBorderY = Number(form2.rightBorderY.value)
    //     const fnInput = form2.fnInput.value
    //
    //     // const range = []
    //     // for (let i = 0; i < rightBorder - leftBorder; i++) {
    //     //     range[i] = leftBorder + i
    //     // }
    //
    //     // Генетический алгоритм
    //     const k = form2.k.value
    //     const k2 = form2.k2.value
    //     const n = form2.n.value
    //     const p = form2.p.value
    //
    //     const flagIter = form2.flagIter.checked
    //     const flagEps = form2.flagEps.checked
    //     const flagEps2 = form2.flagEps2.checked
    //     const epsInput = form2.eps.value
    //
    //     if(!flagIter && !flagEps){
    //         alert('Выберите какой-либо критерий останова!')
    //         return
    //     }
    //
    //     if(!epsInput && !flagEps2 && flagEps){
    //         alert('Выберите точность!')
    //         return
    //     }
    //
    //     console.log(flagIter, flagEps)
    //     const start = new Date().getTime()
    //




    //
    //     console.log('Message posted to worker')
    // })
    //
    // myWorkerGA.onmessage = function(e) {
    //     const progressBar = document.getElementById(`progressGA${GaI}`)
    //
    //     if(e.data.length !== 4){
    //         btnSubmit2.setAttribute('disabled', 'disabled')
    //         btnClear2.setAttribute('disabled', 'disabled')
    //         progressBar.style.transform = e.data
    //         return false
    //     }
    //     progressBar.style.transform = 'translateY(226px)'
    //     const output = document.querySelector(`.main-block-GA-${GaI}`)
    //     const GaLoader = document.getElementById(`GaLoader${GaI}`)
    //     GaLoader.style.display = 'none'
    //
    //     GaI++
    //
    //     GaLoader.style.display = 'none'
    //     e.data.forEach((item) => {
    //         output.innerHTML += `<div>${item}</div>`
    //     })
    //
    //     console.log(e.data)
    //     btnSubmit2.removeAttribute('disabled')
    //     btnClear2.removeAttribute('disabled')
    //
    //     // resultMonte.append(output)
    // }


    const test = {a: 1, b: 2}
    // console.log(JSON.parse(JSON.stringify(test)))
    const bbb = 'xyzt'

    const fn = (f, str,  ...variables) => {
        let scope = {}
        for (let i = 0; i < str.length; i++) {
            scope[str[i]] = variables[i]
        }

        return math.evaluate(f, scope)
    }


    const fff = '4*x*x - 2.1*x*x*x*x + x*x*x*x*x*x/3 + x*y - 4*y*y + 4*y*y*y*y'
    const fff2 = 't + x^2 + y^2 - z'

    console.log(fn(fff2, bbb, 2, 2, 3, 1000))
    // console.log(Math.abs(4 - 5))
    // console.log(math.random(0, 1) < 0.5)

    const functions = [
        {
            function: '(x + 2y - 7)^2 + (2x + y -5)^2',
            borderX: '-10',
            borderY: '10'
        },
        {
            function: '4x^2 - 2.1x^4 + x^6/3 + x*y - 4y^2 + 4y^4',
            borderX: '-5',
            borderY: '5'
        },
        {
            function: '2x^2 - 1.05x^4 + x^6/3 + x*y + y^2',
            borderX: '-5',
            borderY: '5'
        },
        {
            function: '0.26(x^2 + y^2) - 0.48x*y',
            borderX: '-10',
            borderY: '10'
        },
        {
            function: 'x^2 + y^2 - cos(12x) - cos(18y)',
            borderX: '-1',
            borderY: '1'
        },
        {
            function: '(x^2 + y^2)/200 - cos(x)*cos(y/sqrt(2)) + 1',
            borderX: '-100',
            borderY: '100'
        },
        {
            function: 'x^4 + 4x^3 + 4x^2 + y^2',
            borderX: '-5',
            borderY: '5'
        },

        {
            function: 'sin(x+y) + (x+y)^2 - 1.5x + 2.5y + 1',
            borderX: '-1.5',
            borderY: '4',
            borderX2: '-3',
            borderY2: '3',
        },

        {
            function: '(2x^3 * y - y^3)^2 + (6x - y^2 + y)^2',
            borderX: '-10',
            borderY: '10',
        },

        {
            function: '100(y - y^2)^2 + (1 - x)^2 + 90(z - k^2)^2 + (1 - k)^2 + 10.1((y-1)^2 + (z - 1)^2 + 19.8(y - 1)(z - 1))',
            borderX: '-10',
            borderY: '10',
        },
    ]

    const bordersWrapper = document.getElementById('borders')

    const leftBorderXinput = document.getElementById('leftBorderX2')
    const rightBorderXinput = document.getElementById('rightBorderX2')

    const leftBorderYinput = document.getElementById('leftBorderY2')
    const rightBorderYinput = document.getElementById('rightBorderY2')

    const fn2 = document.getElementById('fn2')

    let exception = ['cos', 'sin', 'tan', 'tg', 'ctg']

    fn2.addEventListener('input', (e) => {
        if(!e.target.value){
            bordersWrapper.innerHTML = ''
            return
        }
        let value = e.target.value.match(/[a-z\s]+/ig).join('')
        exception.forEach((item) => {
            value = value.replaceAll(item, '')
            value = value.replaceAll(' ', '')
        })
        let obj = value.split('').reduce((o, v, i) => { o[v] = v; return o; }, {});
        let arrUnique = Object.keys(obj);
        let output = arrUnique.join('')



        // console.log(output)
        bordersWrapper.innerHTML = ''
        for (let i = 0; i < output.length; i++) {
            bordersWrapper.innerHTML += `<div class="border">
                            Границы<strong>&nbsp${output[i]}</strong>: <span class="scobka">(</span>
                            <input required type="text" data-autocomplete="-10" placeholder="-10" name="leftBorder${output[i]}" id="leftBorder${output[i]}" class="leftBorder"/>
                            <span class="tz">;</span>
                            <input required type="text" data-autocomplete="10" placeholder="10" name="rightBorder${output[i]}" id="rightBorder${output[i]}" class="rightBorder"/>
                            <span class="scobka">)</span>
                        </div>`
        }

        functions.forEach((item) => {
            if(e.target.value === item.function){
                document.getElementById(`leftBorder${output[0]}`).value = item.borderX
                document.getElementById(`rightBorder${output[0]}`).value = item.borderY
                document.getElementById(`leftBorder${output[1]}`).value = item.borderX2 ? item.borderX2 : item.borderX
                document.getElementById(`rightBorder${output[1]}`).value = item.borderY2 ? item.borderY2 : item.borderY
            }
        })

        let inputsFn = document.querySelectorAll('input')

        inputsFn.forEach((item) => {
            item.addEventListener('dblclick', (e) => {
                if(!e.target.value && e.target.dataset.autocomplete){
                    e.target.value = e.target.dataset.autocomplete
                }
            })
        })


    })



    flagEps2.addEventListener('input', (e) => {
        if (e.target.checked) {
            form1.eps.value = ''
            form1.eps.setAttribute('disabled', 'disabled')
        }
        else{
            form1.eps.removeAttribute('disabled')
        }
    })


    // const arr = []
    // arr[0] = ['1', '2', '3']
    // arr[0].pop()
    // console.log(arr[0])
    // arr[1] = ['4', '5', '6']
    // const fun = (...v) => {
    //     v.forEach((item) => console.log(item) )
    // }
    // fun(...arr[1])
    // console.log(parseInt(onePoint2('10001000','11111111')[0], 2) / 256 * (20) )
    // console.log(str2)

    let x = 5.25
    // console.log(Math.cos(0))
    let arr = [-10, -4000, -1000, -1000]
    let arr1 = [...arr]
    arr1.splice(0, 1)
    let arr2 = arr1
    //
    // while(arr){
    //
    // }

    console.log(arr.filter((item) => item > -200).length !== 0)
    // console.log(arr.findIndex((item) => item === max(arr)))
})
