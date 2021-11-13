const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );
renderer.setClearColor(0Xb7c3f3,1);
const start_pos=4;
const end_pos=-start_pos;
const Time=7;
var x = document.getElementById("myAudio"); 
camera.position.z = 5;
const loader = new THREE.GLTFLoader();
const text=document.getElementsByClassName("text");
let gameStat="loading";
let LookingBackward=false;
function createCube(size,positionX,rotY=0,color=0Xfbc851){
    const geometry = new THREE.BoxGeometry(size.w,size.h,size.d);
    const material = new THREE.MeshBasicMaterial( { color: color } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x=positionX;
    cube.rotation.y=rotY;
    scene.add( cube );
    return cube;
}
function createTrack(){
    createCube({w:0.2,h:1.8,d:1},start_pos,-0.3);
    createCube({w:0.2,h:1.8,d:1},end_pos,0.3);
    createCube({w:start_pos*2+0.6,h:1.8,d:1},0,0,0Xe5a716).position.z=-1.2;
}
createTrack();
function delay(ms){
  return new Promise(resolve=>setTimeout(resolve,ms));
}
class Doll{
    constructor(){
        loader.load("../models/scene.gltf",(gltf)=>{
            scene.add(gltf.scene);
            gltf.scene.scale.set(0.4,0.4,0.4);
            gltf.scene.position.set(0,-1.35,0);
            this.doll=gltf.scene;
            
        })
    }
    lookBackward(){
        gsap.to(this.doll.rotation,{y:-3.15,duration: .45})
        setTimeout(()=>{LookingBackward=true},150)
    }
    lookForward(){
        gsap.to(this.doll.rotation,{y:0,duration: .45})
        setTimeout(()=>{LookingBackward=false},450)
    }
    async start(){
        this.lookBackward();
        await delay((Math.random()*1000)+1000);
        this.lookForward();
        await delay((Math.random()*750)+750);
        this.start();
    }
}
class Player{
    constructor(){
        const geometry = new THREE.SphereGeometry( 0.3, 32, 16 );
const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );
sphere.position.x=start_pos;
sphere.position.z=+1;
this.player=sphere;
this.playerInfo={
    positionX:start_pos,
    velocity:0
}
    }
    run(){
       this.playerInfo.velocity=0.1;
    }
    update(){
        if(gameStat=="over") {
            gsap.to(doll.rotation,{y:0,duration: .45})
            return;
        };
        this.check();
        this.playerInfo.positionX-=this.playerInfo.velocity;
        this.player.position.x=this.playerInfo.positionX;
    }
    stop(){
       gsap.to(this.playerInfo,{velocity:0,duration:.1})
    }
    check(){
        if(this.playerInfo.velocity>0 && !LookingBackward){
            gameStat="over";
           text[0].innerText="You Lost 😢";
           
           
        }
        if(this.player.position.x<=end_pos+0.6){
            gameStat="over";
            text[0].innerText="You Won👌";
            
        }
    }
}
const player=new Player();
let doll=new Doll();
function startGame(){
   x.play();
    gameStat="started";
    let ProgressBar=createCube({w:5,h:0.2,d:1},0);
    ProgressBar.position.y=3.15;
    gsap.to(ProgressBar.scale,{x:0,duration:Time});
    doll.start();
    setTimeout(() => {
        if(gameStat!="over"){
            text[0].innerText="You run out of time";
        }
        gameStat="over";
    }, Time*1000);
}
async function init(){
    alert("Press arrow up key to move ")
   await delay(500);
   text[0].innerText="Starting in 3";
   await delay(500);
   text[0].innerText="Starting in 2";
   await delay(500);
   text[0].innerText="Starting in 1";
   await delay(500);
   text[0].innerText="Go!!!";
   startGame();
}
init();



function animate(){
    renderer.render(scene,camera);
    // cube.rotation.x+=0.1;
    // cube.rotation.y+=0.1;
    // cube.rotation.z+=0.1;
    // cube.rotation.x+=0.2;
    requestAnimationFrame(animate);
    player.update();
}
animate();
window.addEventListener("resize",onWindowResize,false);
function onWindowResize(){
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    
}
window.addEventListener('keydown',(e)=>{
    if(gameStat!="started") return
    if(e.key=="ArrowUp"){
        player.run();
    }
});
window.addEventListener('keyup',(e)=>{
    if(e.key=="ArrowUp"){
        player.stop();   
    }
})
function playIt(){
    x.play();
}