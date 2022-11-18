const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

let start = true
const friction = 0.989
class Ball{
	constructor(x, y, radius, color, velocity){
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.once = [true, true, true, true]
	}
	draw(){
		c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
    c.fillStyle = this.color
    c.fill()
	}
	update(){
        this.draw()
        if(this.velocity.x > 5){
            this.velocity.x = 5
        }
        if(this.velocity.y > 5){
            this.velocity.y = 5
        }
        if(this.velocity.x < -5){
            this.velocity.x = -5
        }
        if(this.velocity.y < -5){
            this.velocity.y = -5
        }
        
        if(this.once[0]){
		  if(this.x + this.radius*2 - Math.abs(this.velocity.x) >= canvas.width){
		  	this.velocity.x *= -1
			this.once[0] = false
		  }
	    }
	    if(this.once[1]){
	      if(this.x - this.radius - Math.abs(this.velocity.x) <= 0){
		  	this.velocity.x *= -1
			this.once[1] = false
		  }
	    }
	    if(this.once[2]){
	       if(this.y + this.radius - Math.abs(this.velocity.y) >= canvas.height){
		  	this.velocity.y *= -1
			this.once[2] = false
		  }
	    }
	    if(this.once[3]){
	      if(this.y - this.radius - Math.abs(this.velocity.y) <= 0){
		  	this.velocity.y *= -1
			this.once[3] = false
		  }
	    }
	  
	
		if(!this.once[0]){
			if(this.x + this.radius*2 - Math.abs(this.velocity.x) <= canvas.width){
				this.once[0] = true
			}
		}
		if(!this.once[1]){
		    if(this.x - this.radius - Math.abs(this.velocity.x) >= 0){
				this.once[1] = true
			}
		}
		if(!this.once[2]){
		    if(this.y + this.radius - Math.abs(this.velocity.y) <= canvas.height){
				this.once[2] = true
			}
		}
		if(!this.once[3]){
		    if(this.y - this.radius - Math.abs(this.velocity.y) >= 0){
				this.once[3] = true
			}
		}
		
		if(!start){
		    obsticals.forEach((obstical, index) => {
		        const coll = RectCircleColliding(ball,obstical)
                if(coll[0]){
                    ball.velocity.x *= coll[1]
                    ball.velocity.y *= coll[2]
                }     
		    })
		}
		
		if(this.y - this.radius - Math.abs(this.velocity.y) <= -10 || this.y + this.radius - Math.abs(this.velocity.y) >= canvas.height+10 || this.x - this.radius - Math.abs(this.velocity.x) <= -10 || this.x + this.radius*2 - Math.abs(this.velocity.x) >= canvas.width+10){
		    this.x = canvas.width/2
		    this.y = canvas.height/2
		}
        

		this.velocity.x *= friction
        this.velocity.y *= friction
		this.x -= this.velocity.x
		this.y -= this.velocity.y
	}	
}

class Line{
	constructor(x1, y1, x2, y2){
		this.x1 = x1
		this.y1 = y1
		this.x2 = x2
		this.y2 = y2
		this.width = 1
		this.height = 5
	}
	draw(){
		c.beginPath();
        c.moveTo(this.x1, this.y1);
        c.lineTo(this.x2, this.y2);
        c.stroke();
	}
}

class Hole{
	constructor(x, y){
		this.x = x
		this.y = y
		this.radius = 7
		this.color = 'grey'
	}
	draw(){
		c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        c.fillStyle = this.color
        c.fill()
	}
}

class Obstical{
    constructor(x, y){
        this.x = x
        this.y = y
        this.width = (Math.random()*25)+15
        this.height = this.width
    }
    draw(){
        c.fillStyle = 'black'
        c.fillRect(this.x, this.y, this.width, this.height)
        
        while(Math.hypot(this.x-hole.x, this.y-hole.y) < 50){
            hole.x = Math.random()*(canvas.width-10)
		    hole.y = Math.random()*(canvas.height-10)
        }
        if(start){
            while(Math.hypot(this.x-ball.x, this.y-ball.y) < 50){
                this.x = (Math.random()* canvas.width)-50
    		    this.y = (Math.random()* canvas.width)-50
            }   
        }
    }
}

const ball = new Ball(canvas.width/2, canvas.height/2, 5, 'black', {x:0, y:0})
const hole = new Hole(Math.random()*(canvas.width-10), Math.random()*(canvas.height-10))
lines = []
obsticals = []
for(var i=0; i<Math.floor(Math.random()*15)+10;i++){
    obsticals.push(new Obstical((Math.random()* canvas.width)-15, (Math.random()*canvas.height)-15))
}

function RectCircleColliding(circle,rect){
    var distX = Math.abs((circle.x-circle.velocity.x) - rect.x-rect.width/2);
    var distY = Math.abs((circle.y-circle.velocity.y) - rect.y-rect.height/2);
    
    if (distX > (rect.width/2 + circle.radius)) { return [false, 1, 1]; }
    if (distY > (rect.height/2 + circle.radius)) { return [false, 1, 1]; }

    if (distX <= (rect.width/2)) { return [true, 1, -1]; } 
    if (distY <= (rect.height/2)) { return [true, -1, 1]; }

    var dx=distX-rect.width/2;
    var dy=distY-rect.height/2;
    return [(dx*dx+dy*dy<=(circle.radius*circle.radius)), -1, -1];
}

var bounding = canvas.getBoundingClientRect();
let animationId
let mousePos = {
	x: 0,
	y: 0
}
function animate(){
	animationId = requestAnimationFrame(animate)
	c.fillStyle = 'rgba(255, 255, 255, 1)'
	c.fillRect(0, 0, canvas.width, canvas.height)
	
	
	if((Math.hypot(ball.x - hole.x, ball.y - hole.y)-7)-5 < 2){
		ball.x = canvas.width/2
		ball.y = canvas.width/2
		ball.velocity.x = 0
		ball.velocity.y = 0
		ball.y = canvas.width/2
		hole.x = Math.random()*(canvas.width-10)
		hole.y = Math.random()*(canvas.height-10)
        start = true
        obsticals = []
        for(var i=0; i<Math.floor(Math.random()*5)+5;i++){
            obsticals.push(new Obstical((Math.random()* canvas.width)-15, (Math.random()*canvas.height)-15))
        }
	}
	
	ball.update()
	hole.draw()
	if(mouseIsDown){
		lines[lines.length-1].x2 = mousePos.x-bounding.left
	    lines[lines.length-1].y2 = mousePos.y-bounding.top
	}
	lines.forEach((line, index) => {
		line.draw()
	})
	obsticals.forEach((obstical, index) => {
	    obstical.draw()
	})
}

onmousemove = function(e){
    mousePos.x = e.clientX; mousePos.y = e.clientY;
}

let startX
let startY
let mouseIsDown = false
document.addEventListener('mousedown', (event) => {
	mouseIsDown = true
	lines = []
	startX = event.clientX
	startY = event.clientY
	lines.push(new Line(0, 0, 0, 0))
	lines[lines.length-1].x1 = startX-bounding.left
	lines[lines.length-1].y1 = startY-bounding.top
})

let endX
let endY
document.addEventListener('mouseup', (event) => {
    start = false
	mouseIsDown = false
	endX = event.clientX
	endY = event.clientY
	lines[lines.length-1].x2 = endX-bounding.left
	lines[lines.length-1].y2 = endY-bounding.top
	lines = []

	// targetY ballY and targetX ballX
    const angle = Math.atan2(endY - startY, endX - startX);
	const speed = {
		x: (startX -endX)/15 > 20 ? 20 : (startX -endX)/15,
		y: (startY -endY)/15 > 20 ? 20 : (startY -endY)/15
	}
	const velo = {
		x: Math.cos(angle)* speed.x* (Math.floor(angle) == 0 || Math.floor(angle) == -1 ? -1 : 1),
		y: Math.sin(Math.abs(angle))* -speed.y
	}
	ball.velocity.x += velo.x
	ball.velocity.y += velo.y
})

document.addEventListener('keydown', (event) => {
	if(event.key == '/'){
	    ball.x = canvas.width/2
		ball.y = canvas.width/2
		ball.velocity.x = 0
		ball.velocity.y = 0
		ball.y = canvas.width/2
		hole.x = Math.random()*(canvas.width-10)
		hole.y = Math.random()*(canvas.height-10)
        start = true
        obsticals = []
        for(var i=0; i<Math.floor(Math.random()*5)+5;i++){
            obsticals.push(new Obstical((Math.random()* canvas.width)-15, (Math.random()*canvas.height)-15))
        }
	}
})





animate()
