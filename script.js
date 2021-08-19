class Slider{
    constructor({el, active, duration, direction, autoplay, autoplayTime}){
        this.slider = el instanceof HTMLElement ? el : document.querySelector(el);
        this.sliderLines = this.slider.querySelector('.sliderLines');
        this.slides = [...this.sliderLines.children];
        this.prev = this.slider.querySelector('.slider__prev');
        this.next = this.slider.querySelector('.slider__next');
        this.active = active;
        this.duration = duration !== undefined && duration > 300 ? duration : 400;
        this.direction = direction.toUpperCase();
        this.width = this.sliderLines.clientWidth;
        this.height = this.sliderLines.clientHeight;
        this.moveSize = this.direction == 'X' ? this.width : this.height;
        this.sliderLines.style = `
            position: relative;
            overflow: hidden;
        `;
        this.autoplay = autoplay;
        this.autoplayTime = autoplayTime;
        this.posHold = window.innerWidth > 900 ? 300 : 130;
        this.posX1 = 0;
        this.posX2 = 0;
        this.posInit = 0;
        this.touch = true;
        this.interval = '';
        window.addEventListener('resize', ()=> this.adaptive());
        this.adaptive();
        this.setClass();
        if(this.autoplay){
            this.interval  = setInterval(() => {
                this.autoplaying();
            }, this.autoplayTime);
        }
        this.prev.addEventListener('click', () => this.moveLeft());
        this.next.addEventListener('click', () => this.moveRight());
        this.slider.addEventListener('mousedown', (e) => this.swipeStart(e));
        this.slider.addEventListener('touchstart', (e) => this.swipeStart(e));

    }
    adaptive(){
        this.width = this.sliderLines.clientWidth;
        this.height = this.sliderLines.clientHeight;
        this.moveSize = this.direction == 'X' ? this.width : this.height;
        this.posHold = window.innerWidth > 900 ? 300 : 130;
        this.slides.forEach(item=>{
            item.style = `
                position: absolute;
                width: ${this.width}px;
                height: ${this.height}px;
                overflow: hidden;
            `;
            if(item !== this.slides[this.active]){
                item.style.transform = `translate${this.direction}(${this.moveSize}px)`;
            }
            if(item === this.slides[this.slides.length-1]){
                item.style.transform = `translate${this.direction}(${this.moveSize*-1}px)`;
            }
        })
    }
    disableButtons(){
        this.prev.disabled = true;
        this.next.disabled = true;
        setTimeout(() => {
            this.prev.disabled = false;
            this.next.disabled = false;
        }, this.duration);
    }
    moveLeft(){
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.autoplaying();
        }, this.autoplayTime);
        this.slides.forEach(item=>{
            item.style.transition = '0ms';
            if(item !== this.slides[this.active]){
                item.style.transform = `translate${this.direction}(${this.moveSize*-1}px)`;
            }
        })
        this.disableButtons();
        this.slides[this.active].style.transition = `${this.duration}ms`;
        this.slides[this.active].style.transform = `translate${this.direction}(${this.moveSize}px)`;
        this.active--;
        if(this.active < 0) this.active = this.slides.length-1;
        this.setClass();
        this.slides[this.active].style.transition = `${this.duration}ms`;
        this.slides[this.active].style.transform = `translate${this.direction}(0px)`;
    }
    moveRight(){
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.autoplaying();
        }, this.autoplayTime);
        this.slides.forEach(item=>{
            item.style.transition = '0ms';
            if(item !== this.slides[this.active]){
                item.style.transform = `translate${this.direction}(${this.moveSize}px)`;
            }
        })
        this.disableButtons();
        this.slides[this.active].style.transition = `${this.duration}ms`;
        this.slides[this.active].style.transform = `translate${this.direction}(${this.moveSize*-1}px)`;
        this.active++;
        if(this.active == this.slides.length) this.active = 0;
        this.setClass();
        this.slides[this.active].style.transition = `${this.duration}ms`;
        this.slides[this.active].style.transform = `translate${this.direction}(0px)`;
    }
    setClass(){
        for (let i = 0; i < this.slides.length; i++) {
            this.slides[i].classList.remove('activeSlide');
            this.slides[i].classList.remove('prevSlide');
            this.slides[i].classList.remove('nextSlide');
        }
        this.slides[this.active].classList.add('activeSlide');
        if(this.active == 0) this.slides[this.slides.length-1].classList.add('prevSlide');
        else this.slides[this.active].previousElementSibling.classList.add('prevSlide');
        if(this.active == this.slides.length-1) this.slides[0].classList.add('nextSlide');
        else this.slides[this.active].nextElementSibling.classList.add('nextSlide');
    }
    swipeStart(e){
        if(this.direction == 'X'){
            this.posX1 = e.type == 'touchstart' ? e.touches[0].clientX : e.clientX;
        }
        else {
            this.posX1 = e.type == 'touchstart' ? e.touches[0].clientY : e.clientY;
        }
        this.touch = true;
        this.slider.addEventListener('mousemove', (e) => this.swipeMove(e));
        this.slider.addEventListener('touchmove', (e) => this.swipeMove(e));
        document.addEventListener('mouseup', (e) => this.swipeEnd(e));
        document.addEventListener('touchend', (e) => this.swipeEnd(e));
    }
    swipeMove(e){
        if(this.touch){
            if(this.direction == 'X'){
                this.posInit = e.type == 'touchmove' ? e.changedTouches[0].clientX : e.clientX;
            }
            else {
                this.posInit = e.type == 'touchmove' ? e.changedTouches[0].clientY : e.clientY;
            }
            this.posX2 = this.posX1 - this.posInit;
            this.slides.forEach(item=>{
                item.style.transition = '0ms';
                this.slides[this.active].style.transform = `translate${this.direction}(${this.posX2*-1}px)`;
                if(item.classList.contains('prevSlide')){
                   item.style.transform = `translate${this.direction}(${(this.moveSize+this.posX2)*-1}px)` 
                }
                if(item.classList.contains('nextSlide')){
                    item.style.transform = `translate${this.direction}(${this.moveSize-this.posX2}px)` 
                }
            })
        }
    }
    swipeEnd(e){
        if(this.posHold < this.posX2){
            this.moveRight();
        }
        else if(this.posX2 < 0 && this.posX2 < -this.posHold){
            this.moveLeft();
        }
        else{
            this.moveCenter();
        }
        this.touch = false;
        this.posX1 = 0;
        this.posX2 = 0;
        this.posInit = 0;
    }
    moveCenter(){
        this.slides.forEach(item=>{
            item.style.transition = '0ms';
            item.style.zIndex = 0;
            this.slides[this.active].style.transform = `translate${this.direction}(0px)`;
            this.slides[this.active].style.zIndex = 10;
            this.slides[this.active].style.transition = `${this.duration}ms`;
            if(item.classList.contains('prevSlide')){
                item.style.transform = `translate${this.direction}(${this.moveSize*-1}px)`;
                item.style.transition = `${this.duration}ms`;
            }
            if(item.classList.contains('nextSlide')){
                item.style.transform = `translate${this.direction}(${this.moveSize}px)`;
                item.style.transition = `${this.duration}ms`;
            }
        })
    }
    autoplaying(){
        if(this.autoplay){
            this.moveRight();
        }
    }
}
// spread оператор ... - разбирает массив или строку
// let a = [1,2,3,435];
// console.log(...a);
let mySlider = new Slider({
  el: '.slider',
  active: 0,
  duration: 400,
  direction: 'x',
  autoplay: true,
  autoplayTime: 3000
});