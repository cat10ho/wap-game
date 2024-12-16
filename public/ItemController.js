import Item from "./Item.js";
import { loadAssets } from "./Socket.js";

class ItemController {

    INTERVAL_MIN = 0;
    INTERVAL_MAX = 12000;

    nextInterval = null;
    items = [];
    itemUnlocks = [];


    constructor(ctx, itemImages, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.itemImages = itemImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextItemTime();
        this.loadItemUnlocksData();
    }

    async loadItemUnlocksData() {
        try {
            const {itemUnlocks} = await loadAssets();  // Assuming loadAssets fetches data correctly
            this.itemUnlocks = itemUnlocks.data;
        } catch (error) {
            console.error('Failed to load item unlocks:', error);
        }
    }

    setNextItemTime() {
        this.nextInterval = this.getRandomNumber(
            this.INTERVAL_MIN,
            this.INTERVAL_MAX
        );
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createItem(stage) { //여기서 아이템 만드는거 같은데.
        //1. 일단 다 가지고 있음. 스테이지 정보를 대조해서. 비교하고.
        if(stage>=1001){
            const unlock = this.itemUnlocks.find(unlock => unlock.stage_id === stage);
            const validItemId = unlock.item_id;

            const validItemImages = this.itemImages.filter(itemImage =>
                itemImage.id <= validItemId
            );
            
            const index = this.getRandomNumber(0, validItemImages.length - 1); 
            const itemInfo = validItemImages[index];
            const x = this.canvas.width * 1.5;
            const y = this.getRandomNumber(
                10,
                this.canvas.height - itemInfo.height
            );
    
            const item = new Item(
                this.ctx,
                itemInfo.id,
                x,
                y,
                itemInfo.width,
                itemInfo.height,
                itemInfo.image
            );
    
            this.items.push(item);
        };
        
    }


    update(gameSpeed, deltaTime, stage) {
        if(this.nextInterval <= 0) {
            this.createItem(stage); //여기서 아이템 만듬.
            this.setNextItemTime();
        }

        this.nextInterval -= deltaTime;

        this.items.forEach((item) => {
            item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        })

        this.items = this.items.filter(item => item.x > -item.width);
    }

    draw() {
        this.items.forEach((item) => item.draw());
    }

    collideWith(sprite) {
        const collidedItem = this.items.find(item => item.collideWith(sprite))
        if (collidedItem) {
            this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height)
            return {
                itemId: collidedItem.id
            }
        }
    }

    reset() {
        this.items = [];
    }
}

export default ItemController;