import * as THREE from 'https://unpkg.com/three/build/three.module.js'
import { Pane } from 'https://unpkg.com/tweakpane'

//const camera, scene, renderer

const particleCount = 2000

const params = {
    amplitude: 200,
    frequency: 20,
    displacement: 0,
    horizontal_speed_multiplier: 1,
    camera_rotation_speed: 0.01,
    rotation: 0,
}

const particleSystem = {
    init() {
        this.clock = new THREE.Clock(true)

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 5, 3500)
        this.camera.position.z = 500
        this.camera.position.y = 300
        this.camera.lookAt(0, 0, 0)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)

        this.createLight()
        this.particleSystem = this.createParticleSystem()

        this.render = this.render.bind(this)
        this.render()

        // create a new tweakpane instance
        this.pane = new Pane({
            title: 'Parameters',
        })

        // setup our pane to control the know rotation on the y axis
        this.pane.addBinding(params, 'amplitude', {
            min: 0,
            max: 300,
        })
        this.pane.addBinding(params, "frequency", {
            min: 1,
            max: 200,
        })
        this.pane.addBinding(params, "displacement", {
            min: 0,
            max: 10,
        })
        this.pane.addBinding(params, "horizontal_speed_multiplier", {
            min: 0,
            max: 20,
        })
        this.pane.addBinding(params, "camera_rotation_speed", {
            min: 0,
            max: 0.05,
        })
    },
    createLight() {
        const pointLight = new THREE.DirectionalLight(0xcccccc, 2)
        pointLight.position.set(1, -1, 1).normalize();
        this.scene.add(pointLight)
    },
    createParticleSystem() {

        this.particlesGeometry = new THREE.BufferGeometry()
        let positions = new Float32Array(particleCount * 3)
        let colors = new Float32Array(particleCount * 3)

        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() * 400 - 200)
            colors[i] = Math.random()
        }

        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        const particleMaterial = new THREE.PointsMaterial(
            {
                size: 1,
                vertexColors: true
            }
        )

        const particles = new THREE.Points(this.particlesGeometry, particleMaterial)
        this.scene.add(particles)
        return particles
    },
    render() {
        this.deltaTime = this.clock.getDelta()

        for (let i = 0; i < particleCount; i++) {
            const vert = i * 3

            if (this.particlesGeometry.attributes.position.array[vert] > 200) {
                this.particlesGeometry.attributes.position.array[vert] = -200
            }
            else {
                this.particlesGeometry.attributes.position.array[vert] += params.horizontal_speed_multiplier * this.deltaTime
            }
            const xValue = this.particlesGeometry.attributes.position.array[vert]
            this.particlesGeometry.attributes.position.array[vert + 1] = params.amplitude * Math.sin(xValue / params.frequency + params.displacement)
        }
        this.particlesGeometry.attributes.position.needsUpdate = true

        params.rotation += params.camera_rotation_speed
        this.camera.position.x = Math.sin(params.rotation) * 500
        this.camera.position.z= Math.cos(params.rotation) * 500
        this.camera.lookAt(0, 0, 0)
        this.camera.position.needsUpdate = true

        this.renderer.render(this.scene, this.camera)
        window.requestAnimationFrame(this.render)
    }
}

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

const goHome = async function() {
    console.log('going home')
    await fetch('/home')
}

window.onload = () => {
    particleSystem.init()
    showDescription()
    document.querySelector('#show').onclick = showDescription
    document.querySelector('#close').onclick = closeDescription
    document.querySelector('#home').onclick = goHome
} 