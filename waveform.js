import * as THREE from 'https://unpkg.com/three/build/three.module.js'
import { Pane } from 'https://unpkg.com/tweakpane'

const params = {
    color_speed: 1.0,
    point_size: 1.0,
    noise_amp1: 0.31,
    noise_freq1: 0.31,
    speed_modifier1: 1,
    noise_amp2: 1.5,
    noise_freq2: 0.31,
    speed_modifier2: 1,
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
    u_color_speed: {type: "f", value: params.color_speed},
    u_pointsize: { type: "f", value: params.point_size},
    u_noise_amp_1: {type: "f", value: params.noise_amp1},
    u_noise_freq_1 : {type: "f", value: params.noise_freq1},
    u_spd_modifier_1 : {type: "f", value: params.speed_modifier1},
    u_noise_amp_2 : {type: "f", value: params.noise_amp2},
    u_noise_freq_2: {type: "f", value: params.noise_freq2},
    u_spd_modifier_2: {type: "f", value: params.speed_modifier2},
}

const start = function () {
    initCamera()
    const plane = createPlane()
    render()

    const pane = new Pane({
        title: 'Parameters',
    })
    pane.addBinding(params, "color_speed", {
        label: 'color change speed',
        min: 0.0,
        max: 2.0,
    })
    pane.addBinding(params, "point_size", {
        label: 'point size',
        min: 0.0,
        max: 10.0,
    })
    pane.addBinding(params, "noise_amp1", {
        label: 'Wave 1 Amp',
        min: 0.0,
        max: 3.0,
    })
    pane.addBinding(params, "noise_freq1", {
        label: 'Wave 1 Freq',
        min: 0.0,
        max: 3.0,
    })
    pane.addBinding(params, "speed_modifier1", {
        label: 'Wave 1 Speed',
        min: 0.0,
        max: 3.0,
    })
    pane.addBinding(params, "noise_amp2", {
        label: 'Wave 2 Amp',
        min: 0.0,
        max: 3.0,
    })
    pane.addBinding(params, "noise_freq2", {
        label: 'Wave 2 Freq',
        min: 0.0,
        max: 3.0,
    })
    pane.addBinding(params, "speed_modifier2", {
        label: 'Wave 2 Speed',
        min: 0.0,
        max: 3.0,
    })
}

const initCamera = function () {
    camera.position.z = 5
    camera.position.y = -20
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
    uniforms.u_color_speed.value = params.color_speed
    uniforms.u_pointsize.value = params.point_size
    uniforms.u_noise_amp_1.value = params.noise_amp1
    uniforms.u_noise_freq_1.value = params.noise_freq1
    uniforms.u_spd_modifier_1.value = params.speed_modifier1
    uniforms.u_noise_amp_2.value = params.noise_amp2
    uniforms.u_noise_freq_2.value = params.noise_freq2
    uniforms.u_spd_modifier_2.value = params.speed_modifier2

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