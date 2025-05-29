// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class nivel1 extends Phaser.Scene {
  constructor() {
    super("nivel1");
  }

  init(data) {
    this.score = 0;
    this.topscore = data.topscore || 0;
  }

  preload() {
    this.load.tilemapTiledJSON("map2", "public/assets/tilemap/map2.json");
    this.load.image("tileset", "public/assets/tiles.png");
    this.load.image("background", "public/assets/backgrounds.png");
    this.load.image("star", "public/assets/star.png");
    this.load.image("puerta", "public/assets/puerta.png");
    this.load.image("llave", "public/assets/llave.png");

    this.load.spritesheet("dude", "./public/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
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

    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(false);
    this.player.setScale(0.3)

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    platformLayer.setCollisionByProperty({ esColisionable: true });
    this.physics.add.collider(this.player, platformLayer);


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
          fill: "#000",
          
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
          
          this.final = this.physics.add.image(x, y, "star").setScale(1.2).setTint(0x000000);

          break;
        }
      }
    });

    this.physics.add.collider(this.player, this.puerta);
   
        this.physics.add.collider(
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

    this.scoreText = this.add.text(16, 16, `Score:  ${this.score}`, {
      font: "32px Arial",
      fill: "#000",
    });
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
  }

  update() {
    // update game objects
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-300);
  
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(300);
   
    } else {
      this.player.setVelocityY(0);


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
    

  
     this.scoreText.setPosition(
      this.cameras.main.worldView.x +
        this.cameras.main.worldView.width -
        16 -
        this.scoreText.width,
      this.cameras.main.worldView.y + 16
    );


  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.starsCollected++;
    this.scoreText.setText(`Score: ${this.score}`);
    star.total++;

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

     this.add
      .text(
        this.cameras.main.worldView.centerX,
        this.cameras.main.worldView.centerY,
        "¡Victoria!",
        {
          fontSize: "64px",
          fill: "#fff",
        }
      )
      .setOrigin(0.5, 0.5);

    this.player.setTint(0x00ff00); // Cambiar el color del jugador para indicar victoria
    this.time.delayedCall(2000, () => {
      this.scene.start("game", {
        totalscore: this.score,
        topscore: this.topscore, // Assuming you want to set the top score to the current score
      });
    });
  };
}
