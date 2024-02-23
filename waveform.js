import * as THREE from 'https://unpkg.com/three/build/three.module.js'
import { Pane } from 'https://unpkg.com/tweakpane'

const params = {
    amplitude: 32.0,
    function_power: 0.3,
    wave_period: 20.0,
    color_speed: 1.0,
}

//Audio
const audioCtx = new AudioContext()
const audioElement = document.createElement('audio')
audioElement.crossOrigin = "anonymous";
document.body.appendChild(audioElement)
let player = audioCtx.createMediaElementSource(audioElement)
player.connect(audioCtx.destination)
audioElement.src = 'https://cdn.glitch.me/31e22436-4cbb-46eb-867b-ce58d0090363/re-ignition.wav'

const analyser = audioCtx.createAnalyser()
player.connect(analyser)
analyser.fftSize = 1024
const results = new Uint8Array(analyser.frequencyBinCount)

const playAudio = () => {
    audioCtx.resume();
    audioElement.play()
}

const stopAudio = () => {
    audioElement.pause()
}



//Waveform Render
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const clock = new THREE.Clock(true)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 5, 1000)

const uniforms = {
    u_time: { type: "f", value: 0.0 },
    u_data_array: { type: "float[64]", value: results },
    u_amplitude: { type: "f", value: params.amplitude },
    u_modifier: { type: "f", value: params.function_power },
    u_period: {type: "f", value: params.wave_period },
    u_color_speed: {type: "f", value: params.color_speed},
}

const start = function () {
    initCamera()
    const plane = createPlane()
    render()

    const pane = new Pane({
        title: 'Parameters',
    })

    pane.addBinding(params, "amplitude", {
        label: 'volume',
        min: 0,
        max: 100,
    })
    pane.addBinding(params, "function_power", {
        label: 'function power',
        min: 0.1,
        max: 1,
    })
    pane.addBinding(params, "wave_period", {
        label: 'wave period',
        min: 10.0,
        max: 50.0,
    })
    pane.addBinding(params, "color_speed", {
        label: 'color change speed',
        min: 0.0,
        max: 2.0,
    })
}

const initCamera = function () {
    camera.position.z = 30
    camera.position.y = -50
    camera.lookAt(0, 0, 0)
}

const createPlane = function () {
    const geometry = new THREE.PlaneGeometry(64, 64, 64, 64)
    const material = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
        wireframe: true,
        uniforms
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    return mesh
}

function render() {
    analyser.getByteFrequencyData(results)

    uniforms.u_time.value = clock.getElapsedTime()
    uniforms.u_data_array.value = results
    uniforms.u_amplitude.value = params.amplitude
    uniforms.u_modifier.value = params.function_power
    uniforms.u_period.value = params.wave_period
    uniforms.u_color_speed.value = params.color_speed
    audioElement.volume = params.amplitude/100

    renderer.render(scene, camera)
    window.requestAnimationFrame(render)
}

const showDescription = function(){
    document.getElementById('p_desc').hidden = false

    document.getElementById('close').hidden = false
    //controller.setAttribute('display', 'none')

    document.getElementById('show').hidden = true
    //documentation.setAttribute('display', 'flex')
}

const closeDescription = function(){
    document.getElementById('p_desc').hidden = true

    document.getElementById('close').hidden = true

    document.getElementById('show').hidden = false
}


window.onload = () => {
    start()
    document.querySelector('#start').onclick = playAudio
    document.querySelector('#stop').onclick = stopAudio
    showDescription()
    document.querySelector('#close').onclick = closeDescription
    document.querySelector('#show').onclick = showDescription
} 