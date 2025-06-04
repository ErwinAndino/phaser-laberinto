// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class nivel1 extends Phaser.Scene {
  constructor() {
    super("nivel1");
  }

  init(data) {
    this.score = data.score || 0;
    this.topscore = data.topscore || 0;
  }

  preload() {
    this.load.tilemapTiledJSON("map2", "public/assets/tilemap/map2.json");
    this.load.image("tileset", "public/assets/tiles.png");
    this.load.image("background", "public/assets/backgrounds.png");
    this.load.image("star", "public/assets/star.png");
    this.load.image("puerta", "public/assets/puerta.png");
    this.load.image("llave", "public/assets/llave.png");
    this.load.image("final", "public/assets/final.png");
     this.load.image("particle", "./public/assets/particle.png");

    this.load.spritesheet("dude", "./public/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });

        this.load.spritesheet("characters", "./public/assets/characters.png", {
      frameWidth: 24,
      frameHeight: 24,
    });
  }

  create() {
    const map = this.make.tilemap({ key: "map2" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("tiles", "tileset");
    const background = map.addTilesetImage("background", "background");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createLayer("Fondo", background, 0, 0);
    const aboveLayer = map.createLayer("Fondo2", tileset, 0, 0);
    const platformLayer = map.createLayer("Plataformas", tileset, 0, 0);
    const objectsLayer = map.getObjectLayer("Objetos");
    this.objectsLayer = objectsLayer; 

    // Find in the Object Layer, the name "dude" and get position
    const spawnPoint = map.findObject(
      "Objetos",
      (obj) => obj.name === "player"
    );
    console.log("spawnPoint", spawnPoint);

    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "characters", 23);

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(false);
    this.player.setScale(0.5, 0.5); // Adjust the scale of the player


    this.anims.create({
      key: "stop",
      frames: [{ key: "characters", frame: 21 }],
      frameRate: 20,
    });

    //   this.anims.create({
    //   key: "rest",
    //   frames: [{ key: "characters", frame: 23, frame: 21, frame: 22, frame: 21, frame: 23 }],
    //   frameRate: 20,
    //   repeat: -1,
    // });

    this.anims.create({
      key: "move",
      frames: this.anims.generateFrameNumbers("characters", { start: 21, end: 22 }),
      frameRate: 10,
      repeat: -1,
    });

 
    // anims enemy
     this.anims.create({
      key: "Eleft",
      frames: this.anims.generateFrameNumbers("characters", { start: 25, end: 26 }),
      frameRate: 10,
      repeat: -1,
    });
         this.anims.create({
      key: "Eup",
      frames: this.anims.generateFrameNumbers("characters", { start: 26, end: 24 }),
      frameRate: 10,
      repeat: -1,
    });
    

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    platformLayer.setCollisionByProperty({ esColisionable: true });
    this.physics.add.collider(this.player, platformLayer);


         this.enemy = this.physics.add.group();

    // find object layer
    // if type is "stars", add to stars group
    objectsLayer.objects.forEach((objData) => {
      console.log(objData);
      const { x = 0, y = 0, name, type } = objData;
      switch (type) {
        case "enemy": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const enemy = this.enemy.create(x, y, "characters", 24);
          enemy.setBounce(1)
          enemy.name = name; // Set the name of the enemy for later use
          enemy.setScale(0.5);
          if (name === "1") {
            enemy.setVelocityY(50); // Set initial velocity for enemy 1
          } else if (name === "2") {
            enemy.setVelocityX(50); // Set initial velocity for enemy 2
          }
          break;
        }
      }
    });

    this.physics.add.collider(this.enemy, platformLayer);

     this.physics.add.overlap(
      this.player,
      this.enemy,
      this.hitEnemy,
      null,
      this
    );

    this.puerta = this.physics.add.staticGroup();

    // find object layer
    // if type is "stars", add to stars group
    objectsLayer.objects.forEach((objData) => {
      console.log(objData);
      const { x = 0, y = 0, name, type } = objData;
      switch (type) {
        case "puerta": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const puerta = this.puerta.create(x, y, "puerta");
          puerta.name = name; // Set the name of the door for later use
          break;
        }
      }
    });

    this.starsCollected = 0;
       this.puertaText = this.add
      .text(
        this.cameras.main.worldView.centerX,
        this.cameras.main.worldView.centerY,
        "¡Puerta desbloqueada!",
        {
          font: "32px Arial",
          fill: "#f2eb09",
          stroke: "#000",
          strokeThickness: 4,
          
        }
      )
      .setOrigin(0.5, 0.5)
      .setVisible(false);

        this.llave = this.physics.add.group();

    // find object layer
    // if type is "stars", add to stars group
    objectsLayer.objects.forEach((objData) => {
      console.log(objData);
      const { x = 0, y = 0, name, type } = objData;
      switch (type) {
        case "llave": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const llave = this.llave.create(x, y, "llave");
          llave.name = name; // Set the name of the key for later use
          break;
        }
      }
    });

            objectsLayer.objects.forEach((objData) => {
      console.log(objData);
      const { x = 0, y = 0, name, type } = objData;
      switch (name) {
        case "final": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          
          this.final = this.physics.add.image(x, y, "final").setScale(1).setTint(0xf7f012);

          break;
        }
      }
    });

    this.physics.add.collider(this.player, this.puerta);
   
        this.physics.add.overlap(
      this.player,
      this.final,
      this.finish,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.llave,
      this.desbloquearPuerta,
      null,
      this
    );
    // tiles marked as colliding
    /*
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    platformLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
    */

    // Create empty group of starts
    this.stars = this.physics.add.group();

    // find object layer
    // if type is "stars", add to stars group
    objectsLayer.objects.forEach((objData) => {
      console.log(objData);
      const { x = 0, y = 0, name, type } = objData;
      switch (type) {
        case "star": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const star = this.stars.create(x, y, "star");
          star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          break;
        }
      }
    });

    // add collision between player and stars
    this.physics.add.collider(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );
    // add overlap between stars and platform layer
    this.physics.add.collider(this.stars, platformLayer);

    this.scoreText = this.add.text(225, 8, `Score:  ${this.score}`, {
      font: "16px Arial",
      fill: "#fff",
      stroke: "#000",
      strokeThickness: 2,
    }).setOrigin(0.5, 0.5);
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.setZoom(1);


    // Función para emitir partículas de estrellas 


      this.stars.children.iterate((star) => {

       const emitter = this.add.particles(0, 0, 'particle', {
          speedX: { min: -1, max: 1 },
          speedY: { min: -1, max: 1 },
          lifespan: 2000,
          quantity: 1,
          frequency: 500, // emite una partícula cada 500 ms
          scale: { start: 1, end: 0 },
          blendMode: 'ADD',
          follow: star,
          depth: 0,
          tint: 0x05e8f7,
          emitZone: {
            source: new Phaser.Geom.Rectangle(-10, -10, 20, 20),
            type: "random",
          },
        });
       star.emitter = emitter; // Guardar el emisor en la estrella para poder destruirlo más tarde
      });


          // Función para emitir partículas de llaves


      this.llave.children.iterate((llave) => {

       const emitter = this.add.particles(0, 0, 'particle', {
          speedX: { min: -1, max: 1 },
          speedY: { min: -1, max: 1 },
          lifespan: 2000,
          quantity: 1,
          frequency: 500, // emite una partícula cada 500 ms
          scale: { start: 1, end: 0 },
          blendMode: 'ADD',
          follow: llave,
          depth: 0,
          tint: 0xf7f012,
          emitZone: {
            source: new Phaser.Geom.Rectangle(-10, -10, 20, 20),
            type: "random",
          },
        });
       llave.emitter = emitter;
      });

  

  }


  

  update() {
    // update game objects
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-100);

     
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(100);

  
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-100);

       

    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(100);
       

    } else {
      this.player.setVelocityY(0);

    }
    if (this.cursors.right.isDown || this.cursors.left.isDown || 
      this.cursors.up.isDown || this.cursors.down.isDown ) {
      this.player.anims.play("move",true);
    } else {
      this.player.anims.play("stop",true);
      // this.time.delayedCall(4000, () => { 
      //     this.player.anims.play("rest",true);
      //   });
    }
   

    if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
      console.log("Phaser.Input.Keyboard.JustDown(this.keyR)");
      this.scene.restart();
    }

      // Actualiza la posición del texto al centro de la cámara
     this.puertaText.setPosition(
      this.cameras.main.worldView.centerX,
      this.cameras.main.worldView.centerY,
    );
    

  
     this.scoreText.setOrigin(0.5, 0.5).setPosition(
      this.cameras.main.midPoint.x,
      this.cameras.main.worldView.y + 8
    );

    this.enemy.children.iterate((enemy) => {
    if (enemy.active) {
      if (enemy.name === "1") {
        // Comprobar si el enemy está activo
       
         enemy.anims.play("Eup", true);
          // Lógica de movimiento del enemy
        
      }

            if (enemy.name === "2") {
        // Comprobar si el enemy está activo
      enemy.anims.play("Eleft", true);
          // Lógica de movimiento del enemy
        
      }
    }

    });


  }
hitEnemy(player, enemy) {
  enemy.disableBody(true, true);
  if (this.score >= 20) {
    this.score -= 20;
  }else {
    this.score = 0; // Evitar que la puntuación sea negativa
  }
  this.scoreText.setText(`Score:  ${this.score}`);
  player.setTint(0xff0000); // Cambiar el color del jugador para indicar daño
  this.time.delayedCall(500, () => {
  player.clearTint(); // Limpiar el tinte después de un tiempo
  });

}
  collectStar(player, star) {
    star.disableBody(true, true);

    star.emitter.stop(); // Destruye el emisor de partículas de la estrella

    this.score += 10;
    this.starsCollected++;
    this.scoreText.setText(`Score:  ${this.score}`);
    

    // Si quieres activar algo al llegar a 5 estrellas:
  if (this.starsCollected === 5) {
    console.log("¡Has recogido 5 estrellas!");
    this.puerta.children.iterate((puerta) => {
      puerta.disableBody(true, true);
      puerta.setTint(0x00ff00); // Cambia el color para indicar que está desbloqueada
    });
    // Aquí puedes activar lo que quieras, por ejemplo:
    // this.activarPuertaEspecial();
     this.puertaText.setVisible(true);
  this.time.delayedCall(2000, () => {
    this.puertaText.setVisible(false);
  });
  }
  }

  desbloquearPuerta(player, llave) {
    llave.disableBody(true, true);
    llave.emitter.stop(); // Destruye el emisor de partículas de la llave
console.log(`el nombre de la llave es ${llave.name}`);
    

  this.puerta.children.iterate((puerta) => {
    if (puerta.name === llave.name) {
      puerta.disableBody(true, true);
      puerta.setTint(0x00ff00); // Cambia el color para indicar que está desbloqueada
    }
     });


       // Mostrar el texto y ocultarlo después de 2 segundos
  this.puertaText.setVisible(true);
  this.time.delayedCall(2000, () => {
    this.puertaText.setVisible(false);
  });

    };



  finish(player, final) {
    final.disableBody(true, true);

    if (this.score > this.topscore) {
      this.topscore = this.score; // Update the top score if the current score is higher
    }
    

     this.add
      .text(
        this.cameras.main.worldView.centerX,
        this.cameras.main.worldView.centerY,
        "¡Victoria!",
        {
          font: "64px Arial",
                    fill: "#fff",
      stroke: "#000",
      strokeThickness: 4,
        }
      )
      .setOrigin(0.5, 0.5); 

       this.add
      .text(
        this.cameras.main.worldView.centerX,
        this.cameras.main.worldView.centerY + 70,
        `Score: ${this.score}\nTop Score: ${this.topscore}`,
        {
          font: "32px Arial",
          fill: "#fff",
                stroke: "#000",
      strokeThickness: 4,
        }
      )
      .setOrigin(0.5, 0.5);

    this.player.setTint(0x00ff00); // Cambiar el color del jugador para indicar victoria
 this.player.body.enable = false;
  this.player.setVelocity(0, 0);

    this.time.delayedCall(2000, () => {
      this.scene.start("nivel2", {
        score: this.score,
        topscore: this.topscore, // Assuming you want to set the top score to the current score
      });
    });
  };
}
