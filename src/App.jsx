import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

import "./App.scss";

function Cell({ filial, onDrop, onDragStart }) {
  const [isHovering, setIsHovering] = useState(false);

  function handleDrop(e) {
    setIsHovering(false);
    onDrop(e);
  }

  return (
    <div
      onDrop={handleDrop}
      style={{ minHeight: 100, minWidth: 100 }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setIsHovering(true)}
      onDragLeave={() => setIsHovering(false)}
    >
      {filial && (
        <span draggable={true} onDragStart={onDragStart}>
          {isHovering && "mover aqui"}
          {filial.nome}
          <br />
          <small className="text-muted">{filial.cubagem}</small>
        </span>
      )}
    </div>
  );
}

function App() {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "nome",
      headerName: "Nome da rota",
      width: 150,
      editable: true,
    },
    ...[0, 1, 2, 3].map((i) => ({
      field: "filial" + i,
      headerName: "Filial " + (i + 1),
      width: 80,
      // editable: true,
      renderCell: (params) => {
        // console.log({ params }, i);

        return (
          <Cell
            filial={params.row.filiais[i]}
            onDragStart={(e) =>
              handleDragStart(e, {
                filial: params.row.filiais[i],
                source: {
                  rotaIndex: rotas.findIndex((r) => r.id === params.id),
                  filialIndex: i,
                },
              })
            }
            onDrop={(e) =>
              handleDrop(e, {
                rotaIndex: rotas.findIndex((r) => r.id === params.id),
                filialIndex: i,
              })
            }
          />
        );
      },
    })),
    {
      field: "totalCubagem",
      headerName: "Cubagem total",
      width: 150,
      editable: true,
    },
  ];

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
        { nome: "Filial 442", cubagem: 32 },
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
        { nome: "Filial 448", cubagem: 38 },
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
        { nome: "Filial 540", cubagem: 40 },
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
        { nome: "Filial 544", cubagem: 34 },
      ],
      totalCubagem: 72,
    },
  ]);

  console.log({ rotas });

  return <DataGrid rows={rotas} columns={columns} />;

  function handleDragStart(event, data) {
    event.dataTransfer.setData("application/json", JSON.stringify(data));
  }

  function handleDrop(event, dest) {
    event.preventDefault();
    const updatedRotas = [...rotas];

    const { filial, source } = JSON.parse(
      event.dataTransfer.getData("application/json")
    );

    console.log(filial, source, dest);

    let rotaSrc = rotas[source.rotaIndex];
    let rotaDest = rotas[dest.rotaIndex];

    console.log({ rotaSrc, rotaDest });

    if (rotaDest.filiais.length >= 4 && dest.rotaIndex !== source.rotaIndex) {
      alert("Rota cheia");
      return;
    }

    debugger;
    // delete rotaSrc.filiais[source.filialIndex]
    rotaSrc.filiais[source.filialIndex] = null;
    // TODO
    rotaSrc.filiais = rotaSrc.filiais.filter((f) => f !== null);

    rotaSrc.totalCubagem = calcTotalCubagem(rotaSrc.filiais);


    let increment = 0;

    // if (dest.filialIndex + 1 === rotaDest.filiais.length) {
    //   increment = 1;
    // }

    rotaDest.filiais.splice(
      // dest.filialIndex + increment,
      dest.filialIndex,
      // dest.filialIndex + 1 === rotaDest.filiais.length ? dest.filialIndex + 1 : dest.filialIndex,
      // // dest.filialIndex + 1,
      // dest.filialIndex === 0
      //   ? 0
      //   : dest.filialIndex + 1,
      //   // : (dest.filialIndex + 1 === rotaDest.filiais.length ? dest.filialIndex + 1 : dest.filialIndex),
      // //   ? dest.filialIndex + 1
      // //   : dest.filialIndex,
      0,
      filial
    );
    rotaDest.totalCubagem = calcTotalCubagem(rotaDest.filiais);

    // rotaSrc.filiais = rotaSrc.filiais.filter((f) => f !== null);

    updatedRotas[source.rotaIndex] = rotaSrc;
    updatedRotas[dest.rotaIndex] = rotaDest;

    setRotas(updatedRotas);
  }

  function calcTotalCubagem(filiais) {
    return filiais
      .filter((f) => f !== null)
      .reduce((acc, val) => acc + (val.cubagem || 0), 0);
  }
}

export default App;
