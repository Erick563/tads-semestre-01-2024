function alteraNumeroCartao(element) {

    if (element.value == '')
        return

    let numero = element.value.replace(/\D/g, '')
    numero = numero.substring(0, 16)

    let numeroFormatado = ''
    for (let i = 0; i < numero.length; i++) {
        if (i % 4 == 0 && i > 0) {
            numeroFormatado += ' '
        }
        numeroFormatado += numero[i]
    }

    element.value = numeroFormatado
    document.getElementById('numero-cartao').innerText = element.value
}

function validaNumeroCartao(element) {
    if (element.value.length != 19) {
        alert("O número do cartão deve conter 16 dígitos.")
        element.classList.add('is-invalid')
        return
    }

    element.classList.remove('is-invalid')
}

function alteraDataValidade(element) {
    if (element.value == '')
        return
    let valor = element.value.replace(/\D/g, '')

    valor = valor.substring(0, 4)
    let valorFormatado = ''
    for (let i = 0; i < valor.length; i++) {
        if (i === 2 && valor.length > 2) {
            valorFormatado += '/'
        }
        valorFormatado += valor[i]
    }

    element.value = valorFormatado
    document.getElementById('data-validade').innerText = element.value
}

function validaDataValidade(element) {
    if (element.value.length != 5) {
        element.classList.add('is-invalid')
        return
    }

    element.classList.remove('is-invalid')
}

function validaCVV(element) {
    if (element.value.length != 3) {
        element.classList.add('is-invalid')
        return
    }

    element.classList.remove('is-invalid')
}

function alteraCVV(element) {
    if (element.value == '')
        return

    let cvv = element.value.replace(/\D/g, '')
    cvv = cvv.substring(0, 3)
    element.value = cvv
    document.getElementById('cvv').innerText = "CVV: " + element.value
}

function alteraCorCartao(element) {
    document.getElementById('cartao').style.backgroundColor = element.value
}

function alteraLogo(novaImagem) {
    document.getElementById("logo").src = novaImagem
}

function alteraAssinaturaCartao(element) {
    if(element.value == '')
        return
    document.getElementById('assinatura').innerText = element.value
}