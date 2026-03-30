"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AvatarCropModal = dynamic(
  () =>
    import("@/components/studio/avatar-crop-modal").then(
      (module) => module.AvatarCropModal
    ),
  {
    ssr: false,
  }
);

type ProfileFormProps = {
  initialData: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    avatarUrl: string;
    publicName: string;
    jobTitle: string;
  };
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [name, setName] = useState(initialData.name);
  const [email] = useState(initialData.email);
  const [phone, setPhone] = useState(initialData.phone);
  const [cpf, setCpf] = useState(initialData.cpf);
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(initialData.avatarUrl);
  const [publicName, setPublicName] = useState(initialData.publicName);
  const [jobTitle, setJobTitle] = useState(initialData.jobTitle);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(initialData.name);
    setPhone(initialData.phone);
    setCpf(initialData.cpf);
    setAvatarUrl(initialData.avatarUrl || "");
    setAvatarPreviewUrl(initialData.avatarUrl || "");
    setPublicName(initialData.publicName);
    setJobTitle(initialData.jobTitle);
  }, [initialData]);

  const avatarPreview = useMemo(() => {
    return avatarPreviewUrl || "";
  }, [avatarPreviewUrl]);

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    const reader = new FileReader();

    reader.onload = () => {
      setCropImageSrc(reader.result as string);
    };

    reader.onerror = () => {
      setError("Não foi possível ler a imagem selecionada.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  async function handleCroppedImage(blob: Blob) {
    setUploadingAvatar(true);
    setError("");
    setMessage("");

    try {
      const file = new File([blob], "avatar.webp", {
        type: "image/webp",
      });

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/studio/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao enviar imagem.");
        return;
      }

      setAvatarUrl(data.avatarUrl);
      setAvatarPreviewUrl(`${data.avatarUrl}?t=${Date.now()}`);
      setMessage("Foto atualizada com sucesso.");
    } catch {
      setError("Erro ao enviar imagem.");
    } finally {
      setUploadingAvatar(false);
      setCropImageSrc(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (newPassword || confirmPassword || currentPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
          setError("Para alterar a senha, preencha senha atual, nova senha e confirmação.");
          setLoading(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          setError("A confirmação da nova senha não confere.");
          setLoading(false);
          return;
        }

        if (newPassword.length < 6) {
          setError("A nova senha precisa ter pelo menos 6 caracteres.");
          setLoading(false);
          return;
        }
      }

      const response = await fetch("/api/studio/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone: onlyDigits(phone),
          cpf: onlyDigits(cpf),
          avatarUrl,
          publicName,
          jobTitle,
          currentPassword: currentPassword || null,
          newPassword: newPassword || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao salvar perfil.");
        setLoading(false);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Perfil atualizado com sucesso.");
    } catch {
      setError("Erro ao salvar perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">Dados pessoais</h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
            <div className="space-y-4">
              <div className="flex flex-col items-center rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Foto de perfil"
                    className="h-36 w-36 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-full bg-zinc-200 text-3xl font-bold text-zinc-500">
                    {publicName?.trim()?.charAt(0) || name.trim().charAt(0) || "U"}
                  </div>
                )}

                <label className="mt-4 w-full">
                  <span className="mb-2 block text-sm font-medium text-zinc-700">
                    Foto de perfil
                  </span>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Nome completo
                </label>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nome real do usuário"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  E-mail
                </label>
                <Input value={email} disabled />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Telefone
                </label>
                <Input
                  value={phone}
                  onChange={(event) => setPhone(formatPhone(event.target.value))}
                  placeholder="(66) 99999-9999"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  CPF
                </label>
                <Input
                  value={cpf}
                  onChange={(event) => setCpf(formatCpf(event.target.value))}
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Nome público no blog
                </label>
                <Input
                  value={publicName}
                  onChange={(event) => setPublicName(event.target.value)}
                  placeholder="Ex: Dr. Fulano de Tal"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Profissão ou formação
                </label>
                <Input
                  value={jobTitle}
                  onChange={(event) => setJobTitle(event.target.value)}
                  placeholder="Ex: Médico do Trabalho"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Como aparecerá no blog
                </label>
                <Textarea
                  value={`${publicName || name}\n${jobTitle || ""}`.trim()}
                  disabled
                  className="min-h-24"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">Alterar senha</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Senha atual
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Senha atual"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Nova senha
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Nova senha"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Confirmar nova senha
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirmar nova senha"
              />
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading || uploadingAvatar}>
            {loading ? "Salvando..." : "Salvar perfil"}
          </Button>
        </div>
      </form>

      {cropImageSrc ? (
        <AvatarCropModal
          imageSrc={cropImageSrc}
          onCancel={() => setCropImageSrc(null)}
          onConfirm={handleCroppedImage}
        />
      ) : null}
    </>
  );
}