import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";

const inputClass =
  "m-auto w-1/2 border-[1px] border-slate-300 p-2 placeholder:italic placeholder:text-sm";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    albumName: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { albumName, password } = formData;
    const company = "silverback";
    const res = await fetch(
      `/api/s3/getListBucket?company=${company}&album=${albumName}`
    );
    const result = await res.json();
    if (result && result.length > 0) {
      router.push(`/client/${company}/${albumName}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="p-4  w-10/12 shadow-lg flex flex-col gap-4 ">
        <h2 className="my-4 text-xl font-bold">Accès aux albums privés</h2>
        <p className="mb-6">
          Saississez les identifiants que votre photographe vous a fourni.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            id="albumName"
            type="text"
            className={inputClass}
            placeholder="Nom de l'album"
            value={formData.albumName}
            onChange={handleChange}
          />
          <input
            id="password"
            type="password"
            className={inputClass}
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="submit"
            className="border-2 border-slate-700 p-4 font-bodoni uppercase text-slate-700 transition duration-300 ease-in-out hover:bg-slate-700 hover:text-white w-1/2 m-auto cursor-pointer"
            value="Connexion"
          />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
