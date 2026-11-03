"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import {
  X,
  Building2,
  Copy,
  Check,
  UploadCloud,
  FileCheck,
  Trash2,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const WHATSAPP_URL = "https://wa.me/56957286145";

export function TransferModal() {
  const {
    isTransferModalOpen,
    closeTransferModal,
    items,
    subtotal,
    discount,
    coupon,
    totalFinal,
    formatCLP,
    getTransferWhatsAppMessage,
    clearCart,
  } = useCart();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [transferNotified, setTransferNotified] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cerrar al pulsar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isTransferModalOpen) {
        closeTransferModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTransferModalOpen, closeTransferModal]);

  // Prevenir scroll en body cuando está abierto
  useEffect(() => {
    if (isTransferModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isTransferModalOpen]);

  if (!isTransferModalOpen) return null;

  const bankData = {
    banco: "Banco Santander-Chile",
    tipoCuenta: "Cuenta Corriente",
    numeroCuenta: "84-92041-2",
    rut: "18.942.315-7",
    titular: "Pablo Ignacio Valdés Sandoval",
    empresa: "Naxo Resuelve SpA",
    email: "pagos@naxoresuelve.cl",
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback
    }
  };

  const copyAllBankData = async () => {
    const fullText = `DATOS DE TRANSFERENCIA - NAXO RESUELVE
Banco: ${bankData.banco}
Tipo de Cuenta: ${bankData.tipoCuenta}
N° de Cuenta: ${bankData.numeroCuenta}
RUT: ${bankData.rut}
Titular: ${bankData.titular} (${bankData.empresa})
Correo para Comprobante: ${bankData.email}
Monto Total: ${formatCLP(totalFinal)}`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const whatsappMessage = getTransferWhatsAppMessage(selectedFile?.name);
  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleSendWhatsAppNotification = () => {
    setTransferNotified(true);
    // Abrir WhatsApp en pestaña nueva
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop con desenfoque suave tipo porcelana & carbón */}
      <div
        className="fixed inset-0 bg-[#080f1a]/70 backdrop-blur-md transition-opacity duration-300"
        onClick={closeTransferModal}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl my-auto overflow-hidden rounded-3xl border border-[#efeeeb] bg-[#ffffff] shadow-2xl z-10 flex flex-col font-sans text-[#080f1a] animate-in fade-in zoom-in-95 duration-200">
        {/* Header del Modal */}
        <div className="flex items-center justify-between border-b border-[#efeeeb] bg-[#fbf9f6] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080f1a] text-[#3de273] shadow-xs">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#080f1a]">
                  [ Pasarela Manual ]
                </span>
                <span className="rounded-full bg-[#3de273]/15 border border-[#3de273]/30 px-2 py-0.5 font-mono text-[10px] font-bold text-[#080f1a]">
                  0% Comisión
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#080f1a]">
                Pago por Transferencia Bancaria Directa
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={closeTransferModal}
            className="rounded-xl p-2 text-[#526071] transition-colors hover:bg-black/5 hover:text-[#080f1a]"
            aria-label="Cerrar modal de pago por transferencia"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Alerta de notificación enviada si ya avisó */}
          {transferNotified && (
            <div className="rounded-2xl border border-[#3de273]/40 bg-[#3de273]/15 p-4 flex items-start gap-3">
              <Check className="h-5 w-5 text-[#3de273] mt-0.5 shrink-0" />
              <div className="text-xs">
                <div className="font-bold text-[#080f1a]">
                  ¡Notificación preparada y enviada por WhatsApp!
                </div>
                <div className="text-[#526071] mt-0.5">
                  Pablo verificará tu comprobante en minutos para darte acceso al servidor staging y enviarte la propuesta formal de 1 página.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    closeTransferModal();
                  }}
                  className="mt-2 inline-flex items-center gap-1 font-mono text-xs font-bold text-[#080f1a] underline"
                >
                  <span>Vaciar carrito y finalizar</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* 1. Datos Bancarios del Negocio */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#526071]">
                1. Datos de la Cuenta Bancaria
              </span>
              <button
                type="button"
                onClick={copyAllBankData}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#efeeeb] bg-[#fbf9f6] px-3 py-1.5 font-mono text-xs font-bold text-[#080f1a] hover:bg-white hover:border-[#080f1a]/30 transition active:scale-95 shadow-2xs"
              >
                {copiedAll ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#3de273]" />
                    <span className="text-[#080f1a]">¡Copiado Todo!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[#526071]" />
                    <span>Copiar Todos los Datos</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-4 text-xs font-sans">
              {/* Banco */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#526071] block">Banco</span>
                <span className="font-bold text-[#080f1a] text-sm">{bankData.banco}</span>
              </div>

              {/* Tipo de Cuenta */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#526071] block">Tipo de Cuenta</span>
                <span className="font-bold text-[#080f1a] text-sm">{bankData.tipoCuenta}</span>
              </div>

              {/* N° de Cuenta con Botón de Copiar */}
              <div className="space-y-1 sm:col-span-1">
                <span className="font-mono text-[10px] uppercase text-[#526071] block">Número de Cuenta</span>
                <div className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-[#efeeeb]">
                  <span className="font-mono font-black text-[#080f1a] text-sm">{bankData.numeroCuenta}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bankData.numeroCuenta, "cuenta")}
                    className="p-1 rounded text-[#526071] hover:text-[#080f1a] transition"
                    title="Copiar número de cuenta"
                  >
                    {copiedField === "cuenta" ? (
                      <Check className="h-3.5 w-3.5 text-[#3de273]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* RUT con Botón de Copiar */}
              <div className="space-y-1 sm:col-span-1">
                <span className="font-mono text-[10px] uppercase text-[#526071] block">RUT del Titular</span>
                <div className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-[#efeeeb]">
                  <span className="font-mono font-black text-[#080f1a] text-sm">{bankData.rut}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bankData.rut, "rut")}
                    className="p-1 rounded text-[#526071] hover:text-[#080f1a] transition"
                    title="Copiar RUT"
                  >
                    {copiedField === "rut" ? (
                      <Check className="h-3.5 w-3.5 text-[#3de273]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Titular */}
              <div className="space-y-1 sm:col-span-2">
                <span className="font-mono text-[10px] uppercase text-[#526071] block">Titular de la Cuenta</span>
                <span className="font-bold text-[#080f1a]">
                  {bankData.titular}{" "}
                  <span className="text-[#526071] font-normal">({bankData.empresa})</span>
                </span>
              </div>

              {/* Correo de Confirmación */}
              <div className="space-y-1 sm:col-span-2">
                <span className="font-mono text-[10px] uppercase text-[#526071] block">Email para Notificación Bancaria</span>
                <div className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-[#efeeeb]">
                  <span className="font-mono text-[#080f1a]">{bankData.email}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bankData.email, "email")}
                    className="p-1 rounded text-[#526071] hover:text-[#080f1a] transition"
                    title="Copiar correo"
                  >
                    {copiedField === "email" ? (
                      <Check className="h-3.5 w-3.5 text-[#3de273]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Subida de Comprobante de Pago */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#526071]">
                2. Adjuntar Comprobante de Pago
              </span>
              <span className="font-mono text-[11px] text-[#526071]">
                Formatos: JPG, PNG o PDF
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="hidden"
              id="transfer-receipt-input"
            />

            {!selectedFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                  isDragging
                    ? "border-[#3de273] bg-[#3de273]/10"
                    : "border-[#efeeeb] bg-[#fbf9f6] hover:border-[#080f1a]/30 hover:bg-white"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#efeeeb] text-[#526071] shadow-2xs">
                    <UploadCloud className="h-6 w-6 text-[#526071]" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#080f1a]">
                      Haz clic para subir o arrastra aquí tu comprobante
                    </span>
                    <p className="font-mono text-[11px] text-[#526071] mt-0.5">
                      Captura de pantalla de la app bancaria o PDF de transferencia
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#3de273]/40 bg-white p-4 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 overflow-hidden">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Vista previa del comprobante"
                      className="h-12 w-12 rounded-xl object-cover border border-[#efeeeb]"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fbf9f6] border border-[#efeeeb] text-[#3de273] shrink-0">
                      <FileCheck className="h-6 w-6" />
                    </div>
                  )}

                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-[#080f1a] truncate">
                        {selectedFile.name}
                      </span>
                      <span className="rounded bg-[#3de273]/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#080f1a]">
                        Listo
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#526071] block mt-0.5">
                      {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="rounded-lg p-2 text-[#526071] hover:bg-red-50 hover:text-red-600 transition"
                  title="Eliminar archivo seleccionado"
                  aria-label="Eliminar comprobante"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* 3. Desglose del Total a Transferir */}
          <div className="rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-4 space-y-2">
            <div className="flex items-center justify-between font-mono text-xs text-[#526071]">
              <span>Subtotal ({items.length} {items.length === 1 ? "servicio" : "servicios"}):</span>
              <span className="font-bold text-[#080f1a]">{formatCLP(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between font-mono text-xs text-[#3de273] font-bold">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Descuento Cupón ({coupon}):</span>
                </span>
                <span>-{formatCLP(discount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[#efeeeb] pt-2 font-mono">
              <span className="font-bold uppercase tracking-wider text-xs text-[#080f1a]">
                Monto Exacto a Transferir:
              </span>
              <span className="text-xl font-black text-[#080f1a]">
                {formatCLP(totalFinal)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer y Puente Comercial */}
        <div className="border-t border-[#efeeeb] bg-[#fbf9f6] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] text-[#526071]">
            <ShieldCheck className="h-4 w-4 text-[#3de273] shrink-0" />
            <span>Verificación humana directa con Pablo • Sin comisiones de pasarelas</span>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2.5">
            <button
              type="button"
              onClick={closeTransferModal}
              className="flex-1 sm:flex-none rounded-xl border border-[#efeeeb] bg-white px-4 py-3 font-mono text-xs font-bold text-[#526071] hover:text-[#080f1a] transition"
            >
              Volver
            </button>

            <button
              type="button"
              onClick={handleSendWhatsAppNotification}
              className="flex-1 sm:flex-none group inline-flex items-center justify-center gap-2 rounded-xl border border-[#080f1a] bg-[#080f1a] px-5 py-3 font-mono text-xs font-bold text-white shadow-md transition-all hover:border-[#3de273] hover:bg-[#3de273] hover:text-[#080f1a] active:scale-95"
            >
              <MessageCircle className="h-4 w-4 text-[#3de273] transition-colors group-hover:text-[#080f1a]" />
              <span>Avisar y Enviar por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}