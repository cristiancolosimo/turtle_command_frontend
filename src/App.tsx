import React, { Suspense } from 'react';
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

 <TurtleModel position={props.position} scale={[0.4,0.4,0.4]}/>
 {Array(10).fill(0).map((el,k)=>{
   return <Block key={k} position={[k,0,0]} />;
 })}
  </Suspense> 
</Canvas>)
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
  position:[number,number,number]
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
      position:[0,300,0]
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
      <WorldVisualization position={this.state.position}/>
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