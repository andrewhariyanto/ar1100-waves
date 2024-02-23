const showDescription = function(){
    document.getElementById('controller').hidden = true
    //controller.setAttribute('display', 'none')

    document.getElementById('documentation').hidden = false
    //documentation.setAttribute('display', 'flex')
}

const closeDescription = function(){
    document.getElementById('controller').hidden = false

    document.getElementById('documentation').hidden = true

    console.log("closing")
}

const goParticles = async function() {
    await fetch('/particles')
}

const goAudio = async function() {
    await fetch('/waveform')
}

window.onload = () => {
    console.log("onload")
    showDescription()
    document.querySelector('#show').onclick = showDescription
    document.querySelector('#close').onclick = closeDescription
    document.querySelector('#particle').onclick = goParticles
    document.querySelector('#audio').onclick = goAudio
} 