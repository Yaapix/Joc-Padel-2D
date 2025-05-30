const canvas = document.getElementById("jocCanvas");
    const ctx = canvas.getContext("2d");
    const resetButton = document.getElementById("resetButton");

    let paletaEsquerraY;
    let paletaDretaY;
    const alturaPaletaInicial = 100;
    let alturaPaleta;
    const amplePaleta = 10;
    const velocitatPaleta = 10;
    let puntuacioEsquerra;
    let puntuacioDreta;
    let velocitatPilota;
    let pilotes;
    let jocAcabat;

    const columnesBlocs = 3;
    const filesBlocs = 5;
    const ampleBloc = 20;
    const altBloc = 60;
    let blocs;

    let objectesVides = [];

    const tecles = {};
    document.addEventListener("keydown", e => tecles[e.key] = true);
    document.addEventListener("keyup", e => tecles[e.key] = false);

    function inicialitzarVariables() {
      paletaEsquerraY = canvas.height / 2 - 50;
      paletaDretaY = canvas.height / 2 - 50;
      alturaPaleta = alturaPaletaInicial;
      puntuacioEsquerra = 0;
      puntuacioDreta = 0;
      velocitatPilota = 2.5;
      jocAcabat = false;
      resetButton.style.display = "none";

      pilotes = [crearPilota()];

      blocs = [];
      for (let c = 0; c < columnesBlocs; c++) {
        for (let r = 0; r < filesBlocs; r++) {
          blocs.push({ x: 300 + c * (ampleBloc + 10), y: 100 + r * (altBloc + 10), trencat: false });
        }
      }

      objectesVides = [];
    }

    function crearPilota() {
      return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radi: 7,
        velocitatX: velocitatPilota * (Math.random() > 0.5 ? 1 : -1),
        velocitatY: velocitatPilota * (Math.random() > 0.5 ? 1 : -1)
      };
    }

    function mourePaletes() {
      if (tecles["w"] && paletaEsquerraY > 0) paletaEsquerraY -= velocitatPaleta;
      if (tecles["s"] && paletaEsquerraY < canvas.height - alturaPaleta) paletaEsquerraY += velocitatPaleta;
      if (tecles["ArrowUp"] && paletaDretaY > 0) paletaDretaY -= velocitatPaleta;
      if (tecles["ArrowDown"] && paletaDretaY < canvas.height - alturaPaleta) paletaDretaY += velocitatPaleta;
    }

    function dibuixarTot() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.fillRect(20, paletaEsquerraY, amplePaleta, alturaPaleta);
      ctx.fillRect(canvas.width - 30, paletaDretaY, amplePaleta, alturaPaleta);

      pilotes.forEach(pilota => {
        ctx.beginPath();
        ctx.arc(pilota.x, pilota.y, pilota.radi, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.font = "24px Arial";
      ctx.fillText(puntuacioEsquerra, 200, 50);
      ctx.fillText(puntuacioDreta, canvas.width - 230, 50);

      blocs.forEach(bloc => {
        if (!bloc.trencat) {
          ctx.fillStyle = "blue";
          ctx.fillRect(bloc.x, bloc.y, ampleBloc, altBloc);
        }
      });

      objectesVides.forEach(obj => {
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, 10, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function actualitzar() {
      if (jocAcabat) return;

      mourePaletes();

      pilotes.forEach((pilota, index) => {
        pilota.x += pilota.velocitatX;
        pilota.y += pilota.velocitatY;

        if (pilota.y + pilota.radi > canvas.height || pilota.y - pilota.radi < 0) {
          pilota.velocitatY *= -1;
        }

        if (
          pilota.x - pilota.radi < 30 &&
          pilota.y > paletaEsquerraY &&
          pilota.y < paletaEsquerraY + alturaPaleta
        ) {
          pilota.velocitatX *= -1;
        } else if (
          pilota.x + pilota.radi > canvas.width - 30 &&
          pilota.y > paletaDretaY &&
          pilota.y < paletaDretaY + alturaPaleta
        ) {
          pilota.velocitatX *= -1;
        }

        blocs.forEach(bloc => {
          if (!bloc.trencat) {
            if (
              pilota.x > bloc.x && pilota.x < bloc.x + ampleBloc &&
              pilota.y > bloc.y && pilota.y < bloc.y + altBloc
            ) {
              bloc.trencat = true;
              pilota.velocitatX *= -1;
              if (Math.random() < 0.3) {
                pilotes.push(crearPilota());
              }
              if (Math.random() < 0.2) {
                objectesVides.push({ x: bloc.x, y: bloc.y, caient: true });
              }
            }
          }
        });

        if (pilota.x < 0) {
          puntuacioDreta++;
          pilotes.splice(index, 1);
          if (pilotes.length === 0) pilotes.push(crearPilota());
        } else if (pilota.x > canvas.width) {
          puntuacioEsquerra++;
          pilotes.splice(index, 1);
          if (pilotes.length === 0) pilotes.push(crearPilota());
        }
      });

      objectesVides.forEach((obj, i) => {
        obj.y += 3;
        if (
          obj.x > 20 && obj.x < 30 + amplePaleta &&
          obj.y > paletaEsquerraY && obj.y < paletaEsquerraY + alturaPaleta
        ) {
          alturaPaleta += 10;
          objectesVides.splice(i, 1);
        }
        if (
          obj.x > canvas.width - 30 - amplePaleta && obj.x < canvas.width - 20 &&
          obj.y > paletaDretaY && obj.y < paletaDretaY + alturaPaleta
        ) {
          alturaPaleta += 10;
          objectesVides.splice(i, 1);
        }
      });

      if (puntuacioEsquerra >= 5 || puntuacioDreta >= 5) {
        jocAcabat = true;
        resetButton.style.display = "inline-block";
        const pregunta = prompt("¿Te crees lo suficiente mente bueno?")

        if(pregunta === "Si")
        {
          window.alert("La verdad es que no lo eres compi")
        }else
        {
          window.alert("Si tu lo dices...")
        }

      }
    }

    function resetearJuego() {
      inicialitzarVariables();
    }

    function bucle() {
      actualitzar();
      dibuixarTot();
      requestAnimationFrame(bucle);
    }

    inicialitzarVariables();
    bucle();
