class Data {
    constructor(a, b, c, d, e){
        this.id = a
        this.kategori = b
        this.nama = c
        this.harga = d
        this.stok = e
    }

}

class Cart extends Data{
    constructor(a, b, c, d, f, e){
        super(a, b, c, d, e)
        this.qty = f
    }
}


var data = [
    new Data(12, 'Fast Food', 'KFC', 25000, 10),
    new Data(34, 'Pakaian', 'Gaun', 150000, 6),
    new Data(7, 'Kendaraan', 'Honda', 12000000, 5),
    new Data(13, 'Fast Food', 'McDonald', 35000, 2)
]

var cart = []

var arrKategori = ["All", "Fast Food", "Pakaian", "Kendaraan"]

indexEdit = -1
indexDelete = -1

let tampilkanData=()=>{
    var showProduk = data.map((val,index)=>{
        return (
                `<tr>
                    <td>${val.id}</td>
                    <td>${val.kategori}</td>
                    <td>${val.nama}</td>
                    <td>${val.harga}</td>
                    <td>${val.stok}</td>
                    <td><input type="button" id="add${index}" onclick="addToCart('${val.id}')" value="Add"></td>
                    <td><input type="button" id="delete" onclick="deleteData(${index})" value="Delete"></td>
                    <td><input type="button" id="edit" onclick="editData(${index})" value="Edit"></td>
                </tr>`
        )
    }).join('')
    var showKategori = arrKategori.map((val)=>{
        return (
            `<option value="${val}">${val}</option>`
        )
    }).join('')
    document.getElementById('categoryFilter').innerHTML = showKategori
    document.getElementById('categoryInput').innerHTML = showKategori
    document.getElementById('render').innerHTML = showProduk
}
tampilkanData()

let funInputData=()=>{
    var id = Math.floor(Math.random() * 101)
    var nama = document.getElementById('nameInput').value
    var harga = document.getElementById('priceInput').value
    var kategori = document.getElementById('categoryInput').value
    var stok = document.getElementById('stockInput').value
    var obj = {id, kategori, nama, harga, stok}
    data.push(obj)
    document.getElementById('nameInput').value = ''
    document.getElementById('priceInput').value = ''
    document.getElementById('categoryInput').value = ''
    document.getElementById('stockInput').value = ''
    
    tampilkanData()
}


const funFilter=()=>{
    var inputNama = document.getElementById('keyword').value
    var hargaMin = document.getElementById('min').value // bug kalau min dr 0 diganti jadi 10
    var hargaMax = document.getElementById('max').value
    var inputKategori = document.getElementById('categoryFilter').value

    var filterData = data.filter((val)=>{
        var cekNama = val.nama.toLowerCase().includes(inputNama.toLowerCase()) // hasilnya boolean
        if(!inputNama){ // kenapa ini ga guna? kata dino kalau ga diisi pasti true
            cekNama = true // if kosong
        }
        var cekHarga = val.harga >= hargaMin && val.harga <= hargaMax // boolean
        if(!hargaMin || !hargaMax){
            cekHarga = true // if kosong
        }
        var cekKategori = val.kategori == inputKategori && inputKategori !== "All" // boolean
        if(inputKategori == "All"){
            cekKategori = true // if kosong
        }
        return cekNama && cekHarga && cekKategori
    })
   document.getElementById('render').innerHTML = tampilkanFilter(filterData).join('')
}

var tampilkanFilter=(filterarr)=>{
    return filterarr.map((val,index)=>{
        if(index == indexDelete){
            return ( // kalau button delete di klik
                    // kenapa si cancelDelete gaperlu dikasi ${index} di onclick
                    `<tr>
                        <td>${val.id}</td>
                        <td>${val.kategori}</td>
                        <td>${val.nama}</td>
                        <td>${val.harga}</td>
                        <td>${val.stok}</td>
                        <td><button onclick="saveDelete()">Yes</td>
                        <td><button onclick="cancelDelete()">Cancel</td>
                    </tr>`
            )
        }else if(index == indexEdit){
            var showKategori = arrKategori.map((val1)=>{
                if(val1 == 'All'){
                    return (`<option value="${val1}" selected hidden>${val1}</option>`)
                }
                return (
                    `<option value="${val1}">${val1}</option>`
                )
            }).join('')
            return ( // kalau button edit di klik, si dino pakenya value bukan placeholder
                `<tr>
                    <td>${val.id}</td>
                    <td><select id="newKategori${index}">${showKategori}</select></td>
                    <td><input type="text" id="newNama${index}" placeholder="${val.nama}"</td> 
                    <td><input type="text" id="newHarga${index}" placeholder="${val.harga}"></td>
                    <td><input type="text" id="newStok${index}" placeholder="${val.stok}"></td>
                    <td><input type="button" id="add${index}" onclick="addToCart('${val.id}')" value="Add"></td>
                    <td><input type="button" id="save" onclick="saveEdit()" value="Save"></td>
                    <td><input type="button" id="cancel" onclick="cancelEdit()" value="Cancel"></td>
                </tr>`
            )
        }
        return( //tampilan normal

            `<tr>
                <td>${val.id}</td>
                <td>${val.kategori}</td>
                <td>${val.nama}</td>
                <td>${val.harga}</td>
                <td>${val.stok}</td>
                <td><input type="button" id="add${index}" onclick="addToCart('${val.id}')" value="Add"></td>
                <td><input type="button" id="delete" onclick="deleteData(${index})" value="Delete"></td>
                <td><input type="button" id="edit" onclick="editData(${index})" value="Edit"></td>
            </tr>`
        )
    })
}

var indexCart = -1

const addToCart=(id)=>{
    var indexDataPil = data.findIndex((val)=>val.id == id)
    var indexCart = cart.findIndex((val)=>val.id == id)
    // console.log(indexDataPil, indexCart)
    if(data[indexDataPil].stok == 0){
        alert(`Stok ${data[indexDataPil].nama} habis`)
        console.log(id)
        return
        // break
        // return document.getElementById(`add${indexDataPil}`).disabled = true
        // document.getElementById(`add${indexDataPil}`).disabled = false
    }
    if(indexCart == -1){
        cart.push({...data[indexDataPil], qty: 1})
        data[indexDataPil].stok--
        // console.log(data[indexDataPil])
        // console.log(indexDataPil)
    }else{
        cart[indexCart].qty++
        data[indexDataPil].stok--
    }
    tampilkanData()
    tampilkanCart()
    // for(i=0; i<data.length; i++){
    //     var qtyCart
    //     if(num == data[i].id){
    //         for(j=0; j<cart.length; j++){
    //             if(num == cart[j].id){
    //                 indexCart = j
    //                 console.log(num)
    //             }
    //         }
    //         if(indexCart<0){
    //             qtyCart = 1
                // cart.push(new Cart(data[i].id, data[i].kategori, data[i].nama, data[i].harga, qtyCart, data[i].stok))
    //             console.log(indexCart)
    //         }else{
    //             // if(data[indexCart].stok <= 0){
    //             //     alert('Maaf stok sudah habis')
    //             //     console.log('masuk if bawah')
    //             //     // break
    //             // }else{
    //             //     console.log('masuk else bawah')
    //             //     console.log('data.stok: ' + data[indexCart].stok)
    //             // }
    //             cart[indexCart].qty += 1
    //         }
    // }
    // }
}

const deleteCart=(id)=>{
    var indexDataPil = data.findIndex((val)=>val.id == id)
    var indexCart = cart.findIndex((val)=>val.id == id)
    data[indexDataPil].stok += cart[indexCart].qty
    cart.splice(indexCart, 1)
    tampilkanCart()
    tampilkanData()
}

const tampilkanCart=()=>{
    if(cart.length){
        var output = cart.map((val, index)=>{
            return `<tr>
                        <td>${val.id}</td>
                        <td>${val.kategori}</td>
                        <td>${val.nama}</td>
                        <td>${val.harga}</td>
                        <td>${val.qty}</td>
                        <td><input type="button" onclick="deleteCart(${val.id})" value="Delete"></td>
                    </tr>`
        }).join('')
        
        document.getElementById('bawahrender').innerHTML = output
    }else{
        document.getElementById('bawahrender').innerHTML = ''
    }
}

const payCart=()=>{
    var transaksi = '<h2>Transaction Detail</h2>'
    var subtotal = 0
    var output = cart.map((val)=>{
        var indexPilihan = data.findIndex((val2)=>val.nama===val2.nama)
        subtotal += val.harga * val.qty
        // data[indexPilihan].stok -= val.qty
        return(
            `<p>${val.id} | ${val.kategori} | ${val.nama} | Rp ${val.harga}
            | qty : ${val.qty} | Total ${val.nama} = ${val.harga*val.qty}</p>
            | Sisa stok : ${data[indexPilihan].stok}
            `
        )
    })
    // subtotal = Math.ceil(subtotal)
    var totalBayar = `<p><h3>Subtotal = ${subtotal}</h3></p>
                    <p><h3>PPN = ${subtotal * 0.1}</h3></p>
                    <p><h3>TOTAL = ${subtotal * 0.1 + subtotal}</h3></p>
                    <input type="button" value="Belanja lagi" onclick="shopAgain()">`
    document.getElementById('transaksiBayar').innerHTML = transaksi + output.join('') + totalBayar
}

const shopAgain=()=>{
    cart = []
    tampilkanCart()
    tampilkanData()
    document.getElementById('transaksiBayar').innerHTML = 'Selamat belanja'
}

const editData=(index)=>{
    indexEdit = index
    document.getElementById('render').innerHTML = tampilkanFilter(data).join('')
}

const cancelEdit=()=>{
    indexEdit = -1
    document.getElementById('render').innerHTML = tampilkanFilter(data).join('')
}

const deleteData=(index)=>{
    indexDelete = index
    document.getElementById('render').innerHTML = tampilkanFilter(data).join('')
}

const cancelDelete=()=>{ // saat tombol cancel delete di klik
    indexDelete = -1 // kenapa de difine lagi jadi -1? --> biar ga masuk syarat
    document.getElementById('render').innerHTML = tampilkanFilter(data).join('')
}

const saveEdit=()=>{ // saat tombol save di klik
    var inputNamaEdit = document.getElementById('newNama' + indexEdit).value
    var hargaEdit = document.getElementById('newHarga' + indexEdit).value // bug kalau min dr 0 diganti jadi 10
    var inputKategoriEdit = document.getElementById('newKategori' + indexEdit).value
    var stokEdit = parseInt(document.getElementById('newStok' + indexEdit).value)
    // console.log(inputNamaEdit, hargaEdit, inputKategoriEdit, stokEdit)
    data.splice(indexEdit, 1, { // pake cara ini, gapake push biasa karna id nya mau tetep sama, dan lebih mudah
        ...data[indexEdit],
        kategori: inputKategoriEdit,
        nama: inputNamaEdit,
        harga: hargaEdit,
        stok: stokEdit
    })
    indexEdit = -1
    document.getElementById('render').innerHTML = tampilkanFilter(data).join('')
}

const saveDelete=()=>{
    data.splice(indexDelete, 1)
    indexDelete = -1
    document.getElementById('render').innerHTML = tampilkanFilter(data).join('')
}
