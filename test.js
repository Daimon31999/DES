"use strict"

var DES = {
    // Iteration Number of Number Left Shifts table
    INoNLS: [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
    PC_2: [
        14, 17, 11, 24, 1, 5,
        3, 28, 15, 6, 21, 10,
        23, 19, 12, 4, 26, 8,
        16, 7, 27, 20, 13, 2,
        41, 52, 31, 37, 47, 55,
        30, 40, 51, 45, 33, 48,
        44, 49, 39, 56, 34, 53,
        46, 42, 50, 36, 29, 32
    ],
    get get_K_plus() {
        return this.K_plus
    },
    set set_K_plus(x) {
        this.K_plus = x.replace(/ /gi, '')
        this.array = []
    },
    print: function (num_to_not_print_K) {
        var tmp = 0, CD_tmp = '', block_num_CD = 0, block_num_K = 0, K_tmp = ''

        switch (this.arr_CD[0].length) {
            case 24: case 48: block_num_CD = 6; break;
            case 28: case 56: block_num_CD = 7; break;
            default: return -1
        }

        switch (this.arr_Keys[0].length) {
            case 24: case 48: block_num_K = 6; break;
            case 28: case 56: block_num_K = 7; break;
            default: return -1
        }
        document.getElementById('content').innerHTML = "<tr> <th></th><th>CD</th> <th>K</th>  </tr>"
        if (this.arr_CD && this.arr_Keys) {
            for (let element = 0; element < this.arr_CD.length; element++) {
                CD_tmp = ''
                K_tmp = ''
                tmp = 0

                for (let index = 0; index < this.arr_CD[0].length; index++) {
                    if (tmp % block_num_CD == 0)
                        CD_tmp += ' '
                    CD_tmp += this.arr_CD[element][index]
                    tmp++
                }
                tmp = 0
                if (element !== num_to_not_print_K - 1) {
                    for (let index = 0; index < this.arr_Keys[0].length; index++) {
                        if (tmp % block_num_K == 0)
                            K_tmp += ' '
                        K_tmp += this.arr_Keys[element][index]
                        tmp++
                    }
                }


                // console.log(`${name=='' ? 'CD' : name}[${element + 1}] =${CD_tmp}`)
                document.getElementById('content').innerHTML += `<tr><th>${element + 1}</th> <td>${CD_tmp}</td> <td>${K_tmp}</td></tr>`
            }
        }
    },
    shift_CD: function (iteration_num) {
        if (iteration_num > 16 || iteration_num < 1) {
            console.log('Неверное кол-во итераций!!!')
            return null
        }
        this.K_plus = this.K_plus.replace(/ /gi, '')
        var arr = []
        var C = this.K_plus.slice(0, this.K_plus.length / 2)
        var D = this.K_plus.slice(this.K_plus.length / 2, this.K_plus.length)
        var first_part = ''
        var tmpC = C
        var tmpD = D
        for (let index = 0; index < iteration_num; index++) {
            first_part = tmpC.slice(0, this.INoNLS[index])
            tmpC = tmpC.slice(this.INoNLS[index], this.K_plus.length) + first_part

            first_part = tmpD.slice(0, this.INoNLS[index])
            tmpD = tmpD.slice(this.INoNLS[index], this.K_plus.length) + first_part
            arr[index] = tmpC + tmpD
        }
        return arr
    },
    make_CDs: function (iteration_num = 0) {
        this.arr_CD = this.shift_CD(iteration_num)
    },
    make_Keys: function () {
        this.arr_Keys = []
        var tmp_k = []
        var k = []
        for (let i = 0; i < this.arr_CD.length; i++) {
            k = []
            tmp_k = this.arr_CD[i].split('')
            for (let j = 0; j < this.PC_2.length; j++) {
                k.push(tmp_k[this.PC_2[j] - 1])
            }
            this.arr_Keys.push(k.join(''))
        }
    }
}


function calc() {
    document.getElementById('content').innerHTML = ''
    DES.set_K_plus = document.getElementById('inn').value
    DES.make_CDs(16)
    DES.make_Keys()
    DES.print(c1)
}
function init() {
    var rand = confirm("Ввести рандомное число?")
    var c1 = prompt("Какое по счету к не выводить", "напр. 5")
    if (!rand) {
        document.getElementById('content').innerHTML = `
            <div class="my_input">
                <label for="inn">Введите К+ (шеснадцатеричный)</label>
                <input type="text" id="inn">
                <button id="calculate">Посчитать</button>
            </div>`;

        document.getElementById('calculate').addEventListener("click", function () {
            var hex = document.getElementById('inn').value
            var dec = parseInt(hex,16)
            var bin = Number(dec).toString(2)
            DES.set_K_plus = bin
            DES.make_CDs(16)
            DES.make_Keys()
            DES.print(c1)
        });

    }
    else {
        var t = ''
        for (let i = 0; i < 56; i++) {
            t += Math.round(Math.random())
        }
        DES.set_K_plus = t
        DES.make_CDs(16)
        DES.make_Keys()
        DES.print(c1)
    }
}

init()