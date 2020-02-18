import $ from 'jquery'
class MyCanvas{

    constructor(canvasId, boxId){
        this.canvas = document.getElementById(canvasId)
        this.box = document.getElementById(boxId)
        this.img = this.box.getElementsByTagName('img')[0]
        this.ctx = this.canvas.getContext('2d');

        this.isDraw = false
        this.isDrawDui = false
        this.isDrawBandui = false
        this.isDrawWrong = false
        this.offsetLeft = this.box.offsetLeft
        this.offsetTop = this.box.offsetTop
        this.old_point = {x:0, y: 0}
        this.new_point = {x:0, y: 0}

        this.canvas.ontouchstart = (e) => {
            console.log(e)
            this.old_point.x = e.touches[0].pageX - this.offsetLeft
            this.old_point.y = e.touches[0].pageY - this.offsetTop + this.box.scrollTop
            console.log(e.touches[0].pageX, e.touches[0].pageY)
            console.log(this.offsetLeft, this.offsetTop)

            if(this.isDrawDui){
                let first = {
                    x: this.old_point.x - getRealPX(8),
                    y: this.old_point.y
                }
                let second = {
                    x: this.old_point.x,
                    y: this.old_point.y + getRealPX(8)
                }
                let third = {
                    x: this.old_point.x + getRealPX(16),
                    y: this.old_point.y - getRealPX(8)
                }
                this.ctx.lineWidth = getRealPX(1)
                this.ctx.beginPath()
                this.ctx.moveTo(first.x, first.y)
                this.ctx.lineTo(second.x, second.y)
                this.ctx.stroke()
                this.ctx.moveTo(second.x, second.y)
                this.ctx.lineTo(third.x, third.y)
                this.ctx.stroke()
            }else if(this.isDrawBandui){
                let first = {
                    x: this.old_point.x - getRealPX(8),
                    y: this.old_point.y
                }
                let second = {
                    x: this.old_point.x,
                    y: this.old_point.y + getRealPX(8)
                }
                let third = {
                    x: this.old_point.x + getRealPX(16),
                    y: this.old_point.y - getRealPX(8)
                }
                let four = {
                    x: this.old_point.x + getRealPX(2),
                    y: this.old_point.y - getRealPX(6)
                }
                let five = {
                    x: this.old_point.x + getRealPX(14),
                    y: this.old_point.y + getRealPX(6)
                }
                this.ctx.lineWidth = getRealPX(1)
                this.ctx.beginPath()
                this.ctx.moveTo(first.x, first.y)
                this.ctx.lineTo(second.x, second.y)
                this.ctx.stroke()
                this.ctx.beginPath()
                this.ctx.moveTo(second.x, second.y)
                this.ctx.lineTo(third.x, third.y)
                this.ctx.stroke()
                this.ctx.beginPath()
                this.ctx.moveTo(four.x, four.y)
                this.ctx.lineTo(five.x, five.y)
                this.ctx.stroke()
            }
            else if(this.isDrawWrong){
                let first = {
                    x: this.old_point.x - getRealPX(8),
                    y: this.old_point.y - getRealPX(8)
                }
                let second = {
                    x: this.old_point.x + getRealPX(8),
                    y: this.old_point.y + getRealPX(8)
                }
                let third = {
                    x: this.old_point.x - getRealPX(8),
                    y: this.old_point.y + getRealPX(8)
                }
                let four = {
                    x: this.old_point.x + getRealPX(8),
                    y: this.old_point.y - getRealPX(8)
                }
                this.ctx.lineWidth = getRealPX(1)
                this.ctx.beginPath()
                this.ctx.moveTo(first.x, first.y)
                this.ctx.lineTo(second.x, second.y)
                this.ctx.stroke()
                this.ctx.beginPath()
                this.ctx.moveTo(third.x, third.y)
                this.ctx.lineTo(four.x, four.y)
                this.ctx.stroke()
            }
        }
        this.canvas.ontouchmove = (e) => {
            if(!this.isDraw)
                return
            this.new_point.x = e.touches[0].pageX - this.offsetLeft
            this.new_point.y = e.touches[0].pageY- this.offsetTop + this.box.scrollTop
            this.ctx.beginPath()
            this.ctx.moveTo(this.old_point.x, this.old_point.y)
            this.ctx.lineTo(this.new_point.x, this.new_point.y)
            this.ctx.stroke()
            this.old_point.x = this.new_point.x
            this.old_point.y = this.new_point.y
        }
        this.canvas.ontouchend = (e) => {
            console.log('ontouchend')
        }
        this.box.onscroll = ()=>{

            //console.log(this.img.offsetLeft, this.img.offsetTop)
        }
    }
    mo(e){
        e.preventDefault();
    }
    setWH(width, height){
        this.canvas.setAttribute('width', width)
        this.canvas.setAttribute('height', height)
        this.ctx.strokeStyle = 'red'
        this.ctx.lineWidth = 1
    }
    //自由画笔
    drawLine(){

        this.box.addEventListener('touchmove', this.mo, { passive: false });
        this.isDraw = true
        this.ctx.lineWidth = getRealPX(1)
    }
    cancelDrawLine(){
        this.box.removeEventListener('touchmove', this.mo, { passive: false });
        this.isDraw = false
    }
    //画对勾
    drawDui(){
        this.isDrawDui = true
    }
    cancelDrawDui(){
        this.isDrawDui = false
    }
    //画半对勾
    drawBandui(){
        this.isDrawBandui = true
    }
    cancelDrawBandui(){
        this.isDrawBandui = false
    }
    //画叉号
    drawWrong(){
        this.isDrawWrong = true
    }
    cancelDrawWrong(){
        this.isDrawWrong = false
    }
}

export default MyCanvas;


/*
<Scrollbars
                            style={{ height: this.state.contentHeight }}
                            autoHide
                            autoHideTimeout={800}
                            autoHideDuration={700}
                            id="main_box"
                            renderThumbVertical={({ style, ...props })=>{
                                const thumbStyle = {
                                    width: '3px',
                                    backgroundColor: '#000000',
                                    opacity: '0.2',
                                    borderRadius: '6px'
                                };
                                return (
                                    <div
                                        style={{ ...style, ...thumbStyle }}
                                        {...props}/>
                                );

                            }}
                        >
                            <img src={this.state.image_url} id="main_image" onLoad={this.onImgLoad.bind(this)}/>
                            <canvas id="main_canvas" className="main_canvas"></canvas>
                        </Scrollbars>
 */