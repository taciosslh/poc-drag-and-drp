import { useState } from "react";
import "./App.scss";

function Cell() {
  const [isHovering, setIsHovering] = useState(false)

  return ()
}

function App() {
  const [rotas, setRotas] = useState([
    {
      id: 1,
      nome: "Rota 1",
      filiais: [
        { nome: "Filial 140", cubagem: 10 },
        { nome: "Filial 240", cubagem: 20 },
      ],
      totalCubagem: 30,
    },
    {
      id: 2,
      nome: "Rota 2",
      filiais: [{ nome: "Filial 145", cubagem: 15 }],
      totalCubagem: 15,
    },
    {
      id: 3,
      nome: "Rota 3",
      filiais: [
        { nome: "Filial 142", cubagem: 12 },
        { nome: "Filial 242", cubagem: 22 },
        { nome: "Filial 342", cubagem: 32 },
      ],
      totalCubagem: 66,
    },
    {
      id: 4,
      nome: "Rota 4",
      filiais: [
        { nome: "Filial 148", cubagem: 18 },
        { nome: "Filial 248", cubagem: 28 },
        { nome: "Filial 348", cubagem: 38 },
      ],
      totalCubagem: 84,
    },
    {
      id: 5,
      nome: "Rota 5",
      filiais: [
        { nome: "Filial 240", cubagem: 20 },
        { nome: "Filial 340", cubagem: 30 },
        { nome: "Filial 440", cubagem: 40 },
      ],
      totalCubagem: 90,
    },
    {
      id: 6,
      nome: "Rota 6",
      filiais: [
        { nome: "Filial 144", cubagem: 14 },
        { nome: "Filial 244", cubagem: 24 },
        { nome: "Filial 344", cubagem: 34 },
      ],
      totalCubagem: 72,
    },
  ]);
  console.log(rotas);

  const handleDrop = (event, rotaDestIndex, filialDestIndex) => {
    event.preventDefault();
    const updatedRotas = [...rotas];

    const {
      filial,
      filialIndex: filialSrcIndex,
      rotaIndex: rotaSrcIndex,
    } = JSON.parse(event.dataTransfer.getData("application/json"));

    console.log({ filial, filialDestIndex, filialSrcIndex });

    debugger

    const rotaDest = rotas[rotaDestIndex];
    // if (rotaDest.filiais[filialIndex]) {
    //   // TODO mudar cursor
    //   alert('Escolha uma célula vazia!')
    //   return
    // }
    // rotaDest.filiais[filialIndex] = filial;

    // rotaSrc.filiais = rotaSrc.filiais.filter(
    //   (_, index) =>
    //     index != rotaSrc.filiais.findIndex((f) => f.nome == filial.nome)
    // );
    const rotaSrc = rotas[rotaSrcIndex];

    if (rotaDest.filiais.length >= 3 && rotaDestIndex != rotaSrcIndex) {
      alert('Rota cheia')
      return;
    }

    rotaSrc.filiais[filialSrcIndex] = null;
    rotaSrc.totalCubagem = rotaSrc.filiais
      .filter((f) => f !== null)
      .map((f) => f.cubagem)
      .reduce((acc, val) => acc + (val || 0), 0);

    rotaDest.filiais.splice(
      filialDestIndex + 1 === rotaDest.filiais.length
        ? filialDestIndex + 1
        : filialDestIndex,
      0,
      filial
    );
    rotaDest.totalCubagem = rotaDest.filiais
      .filter((f) => f !== null)
      .map((f) => f.cubagem)
      .reduce((acc, val) => acc + (val || 0), 0);

    rotaSrc.filiais = rotaSrc.filiais.filter((f) => f !== null);

    

    updatedRotas[rotaSrcIndex] = rotaSrc;
    updatedRotas[rotaDestIndex] = rotaDest;

    // if (rotaSrcIndex !== rotaDestIndex) {

    // rotaSrc.filiais = rotaSrc.filiais.filter((_, index) => f.nome != filial.nome);
    // }

    setRotas(updatedRotas);
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const drag = (event, data) => {
    event.dataTransfer.setData("application/json", JSON.stringify(data));
  };

  return (
    <div className="container mt-5">
      <table className="table cubagem-table">
        <thead>
          <tr>
            <th>Nome da Rota</th>
            <th>Filial 1</th>
            <th>Filial 2</th>
            <th>Filial 3</th>
            <th>Total de Cubagem</th>
          </tr>
        </thead>
        <tbody>
          {rotas.map((rota, rotaIndex) => (
            <tr key={rota.id}>
              <td>{rota.nome}</td>
              {rota.filiais.map((filial, index) => (
                <td
                  key={`rota_${rota.id}_filial_${index}`}
                  onDrop={(event) => handleDrop(event, rotaIndex, index)}
                  onDragOver={allowDrop}
                >
                  {filial.cubagem && (
                    <span
                      draggable="true"
                      onDragStart={(e) =>
                        drag(e, { filial, rotaIndex, filialIndex: index })
                      }
                    >
                      {filial.nome}
                      <br />
                      <small className="text-muted">{filial.cubagem}</small>
                    </span>
                  )}
                </td>
              ))}
              {Array.from({ length: 3 - rota.filiais.length }).map(
                (_, index) => (
                  <td
                    key={`rota_${rota.id}_filial_${
                      index + rota.filiais.length
                    }`}
                    onDrop={(event) =>
                      handleDrop(event, rotaIndex, index + rota.filiais.length)
                    }
                    onDragOver={allowDrop}
                  />
                )
              )}
              <td>{rota.totalCubagem}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
