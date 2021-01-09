enum Direction {
        UP = 1,
        DOWN = -1,
        FRONT = 0,
        LEFT = 2,
        RIGHT = 3,
        BACK = 4
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
export class Turtle {
    ws: WebSocket;
    selectedSlot:number = 1;
    invetory:Array<Slot> = Array(16).fill(0);
    name:string = "";
    turtleID:number=0;
    position:{x:number,y:number,z:number, DIRECTION:string}={x:0,y:0,z:0,DIRECTION:"FRONT"}
    
    constructor(ws: WebSocket) {
        this.ws = ws;
        
        this.ws.onopen =  this.onOpenWS;
    }
    onOpenWS=()=>{
        this.ws.send(JSON.stringify({
            type: "connect",
            usertype: "user"
        }));
        this.setName("TARTARUGA")
        this.getInventory()
        this.getID();
        //this.setName("Gianfranco");
    };
    destroyConn(){
        this.ws.close()
    }
    async exec <T> (command: string): Promise <T> {
        return new Promise(r => {
            
            this.ws.send(JSON.stringify({
                type: "eval",
                command: command,
                turtleID:this.turtleID
            }));
            
        })
    }
    async getSelectedSlot(){
       // return await this.exec<boolean>(`turtle.forward()`);
    }
    async update(){

    }
    async dig(direction: Direction) {
        return await this.exec<boolean>(`dig(${direction})`);
    }
    async inspect() {
        return await this.exec<boolean>(`inspectAll()`);
    }
    async forward() {
        
        return await this.exec<boolean>(`move(${Direction.FRONT})`);
    }
    async back() {
        
        return await this.exec<boolean>(`move(${Direction.BACK})`);
    }
    async turnLeft() {
        return await this.exec<boolean>(`turn(${Direction.LEFT})`);
    }
    async turnRight() {
        return await this.exec<boolean>(`turn(${Direction.RIGHT})`);
    }
    async up() {
        
        return await this.exec<boolean>(`move(${Direction.UP})`);
    }
    async down() {
        
        return await this.exec<boolean>(`move(${Direction.DOWN})`);
    }
    async refuel() {
        await this.exec<boolean>(`turtle.refuel()`);
    }
    async getName(){
        await this.exec<string>(`getName()`);
    }
    async setName(name:string){
        await this.exec<boolean>(`os.setComputerLabel("${name}")`)
    }
    async setID(id:number){
        this.turtleID = id;
        //await this.exec<boolean>(`setID(${id})`)
    }
    async getID(){
        await this.exec<boolean>(`getID()`)
    }
    async selectSpecificSlot(slotID:number) {
        await this.exec(`turtle.select(${slotID})`);
        this.selectedSlot = slotID;
        return slotID;
        /**
         * 1  2  3  4
         * 5  6  7  8
         * 9  10 11 12
         * 13 14 15 16
         */
    }
    async getInventory() {
        await this.exec<boolean>(`getInventory()`);
    }
    async place(direction: Direction) {
        if(direction !== Direction.FRONT &&  direction !== Direction.UP && direction !== Direction.DOWN)
        await this.exec<boolean>(`place(${direction})`)
        else throw console.log("MOVIMENTO NON SUPPORTATO");
    }
}