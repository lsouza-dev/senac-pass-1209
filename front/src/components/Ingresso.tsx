import { QrCode, QrCodeIcon } from "lucide-react";
import { useEffect } from "react"
export default function Ingresso({
  printing,
  data,
  onFinish,
}: {
  printing: boolean;
  data: any;
  onFinish: () => void;
}) {
  useEffect(() => {
    if (printing) {
      setTimeout(() => {
        window.print();
        onFinish(); // volta a variável depois de imprimir
      }, 100); // pequeno delay garante renderização
    }
  }, [printing]);

  if (!printing) return null;

  return (
    <div className="grid grid-cols-[30%_1fr]">
      <div className="col-span-2 grid grid-cols-[30%_1fr]">
        <div className="print:bg-azul flex flex-col items-center justify-center ">
          <img src="/logo_branca.png" className="h-2/3" alt="Logo" />
        </div>
        <div className="print:bg-rosa bg-pink-500 w-full flex flex-col items-center  gap-4 p-5">
          <div className="w-full h-full flex flex-col justify-center">
            <p className="font-semibold text-2xl">{data.eventos.dt_inicio}</p>
            <h1 className="font-bold text-3xl">{data.eventos.nome}</h1>
          </div>
        </div>
      </div>
      <div className="grid col-2 gap-4 mt-10">
        <div className="w-full flex flex-col">
          <p className="font-semibold">Ingresso:</p>
          <h1 className="font-bold text-xl">{data.id_reserva}</h1>
        </div>
        <div className="w-full flex flex-col">
          <p className="font-semibold">Cliente:</p>
          <h1 className="font-bold text-xl">{data.clientes.nome}</h1>
        </div>
        <div className="w-full flex flex-col">
          <p className="font-semibold">Setor:</p>
          <h1 className="font-bold text-xl">{data.setores.nome}</h1>
        </div>
        <div className="w-full flex flex-col">
          <p className="font-semibold">Local:</p>
          <h1 className="font-bold text-xl">{data.eventos.local}</h1>
        </div>
        <div className="w-full flex flex-col">
          <QrCodeIcon size={200} />
        </div>

      </div>
    </div>
  );
}
