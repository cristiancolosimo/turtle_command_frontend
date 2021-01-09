import React, { Suspense,useEffect } from 'react';
import { Canvas, MeshProps, useFrame } from 'react-three-fiber'
import type { Mesh } from 'three'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import {Turtle} from './turtle';
import { OrbitControls } from '@react-three/drei/OrbitControls';
import { Sky } from '@react-three/drei';

import  TurtleModel from './3D_Model/Turtle';

const Block = (props:any)=>{
 return (<mesh
  {...props}
  >
  <boxBufferGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color={"blue"} />
</mesh>) 

}

const WorldVisualization = (props:any)=>{
  
  return (<Canvas style={{height:"100%",minHeight:"500px"}} >
    
  <ambientLight />
  <pointLight position={[10, 10, 10]} />
  <OrbitControls />
  <Sky/>
  <Suspense fallback={null}>

 <TurtleModel {...props}  />
 {Object.values(props.world).filter((value:any)=>value.name !== "air")
.map((el:any,k:number)=>{
   return <Block key={k} position={[el.position.z,el.position.y,el.position.x]} />;
 })}
  </Suspense> 
</Canvas>)
}

interface Block{
  meta:number,
  name:string,
  position:{x:number,y:number,z:number, DIRECTION:string}
}

interface Item{
damage:number,
count:number,
name:string
}
interface Slot{
  data:undefined|Item,
  slot:number
}

interface state{
  
  turtle:Turtle,
  list:Array<string>,
  inputText:string,
  inventory:Array<Slot>,
  selected:number,
  position:{x:number,y:number,z:number, DIRECTION:string},
  world:any
}

class App extends React.Component<any,state>{
  
  constructor(props:any){
    super(props);
    this.state={
      turtle:new Turtle(new WebSocket("ws://localhost:5757")),
      list:[""],
      inputText:"",
      inventory:Array(16).fill(0),
      selected:1,
      position:{x:0,y:0,z:0,DIRECTION:"FRONT"},
      world:{}
    }
  }
  readPosition(){
    console.log(this.state.turtle.position)
    this.setState({
      position: this.state.turtle.position
    })
    
    
  }
  componentWillUnmount(){
    this.state.turtle.destroyConn();
  }
  componentDidMount(){
    
    this.state.turtle.ws.onmessage = (messagge) => {
      const parsed = JSON.parse(messagge.data);
      console.log(JSON.parse(messagge.data))
      if(parsed.type === "update" && parsed.datatype ==="location"){
        this.state.turtle.position = parsed.data;
        this.setState({
          position:parsed.data
        })
      }
      if(parsed.type === "update" && parsed.datatype ==="inspectBlock"){
        let tempworld = this.state.world;
        tempworld[`X:${parsed.data.front.position.x},Y:${parsed.data.front.position.y},Z:${parsed.data.front.position.z}`] = parsed.data.front
        tempworld[`X:${parsed.data.top.position.x},Y:${parsed.data.top.position.y},Z:${parsed.data.top.position.z}`] = parsed.data.top
        tempworld[`X:${parsed.data.bottom.position.x},Y:${parsed.data.bottom.position.y},Z:${parsed.data.bottom.position.z}`] = parsed.data.bottom
        console.log(tempworld)
        this.setState({
          world:tempworld
        })
      }
      if(parsed.type === "update" && parsed.datatype ==="inventory"){
        this.state.turtle.invetory = parsed.data;
        this.setState({
          inventory:parsed.data
        })
      }
      /*
      let list = this.state.list;
      //list.push(messagge as unknown as string)
      this.setState({
        list:list
      })
      */

    };

  }
  
  render(){
    let {turtle,inputText,inventory,selected} = this.state;
    console.log(this.state.position)
    return(
      <>
    <div style={{position:"absolute",zIndex:100}}>
      <input type="text" value={inputText} onChange={(el)=> this.setState({inputText:el.target.value})}/>
      <button onClick={()=>turtle.exec(inputText)}>Send</button>
    <button onClick={()=>turtle.forward()}>Avanti</button>
    <button onClick={()=>turtle.back()}>Indientro</button>
    <button onClick={()=>turtle.up()}>Sopra</button>
    <button onClick={()=>turtle.down()}>Sotto</button>
    <button onClick={()=>turtle.turnLeft()}>Gira a sinistra</button>
    <button onClick={()=>turtle.turnRight()}>Gira a destra</button>
    <button onClick={()=>turtle.inspect()}>Detect block</button>
    <button onClick={()=>turtle.getInventory()}>Inventario</button>
    <button onClick={()=>this.readPosition()}>Posizione</button>
    </div>
    <div style={{width:"200px",position:"absolute",zIndex:120,top:"50px"}}>
        {inventory.map((el,k)=>{
          return (
          <Tooltip title={el.data?el.data.name:""} key={k}> 
            <p style={{background:selected===(k+1)?"green":"grey",width:"25px",height:"25px",float:"left",margin:"10px"}} onClick={()=>{turtle.selectSpecificSlot(k+1);this.setState({selected:k+1 })}}>{el.data?el.data.count:""}</p>
            </Tooltip>);
        })}
      </div>
      <WorldVisualization position={this.state.position} world={this.state.world}/>
    </>)
  }
}
export default App;

/**
 * 
 *  <Canvas resize={{scroll:true}} orthographic camera={{ zoom: 50, position: [0, 0, 100] }}>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <Box position={[-1, 0, 0]} />
    <Box position={[2, 0, 0]} />
  </Canvas>
 */