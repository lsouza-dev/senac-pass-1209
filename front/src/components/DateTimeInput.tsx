import React from "react";

const DateTimeInput = ({
  name1,
  name2,
  label,
  placeholder,
  type = "date",
  validators,
  register,
  disabled = false,
  errors,
  ...props
}) => {
  return (
    <div className="grid gap-2">
      <div className="grid gap-4">
        <label className="capitalize text-2xl font-semibold" htmlFor={name1}>
          {label[0]}
        </label>
        <div className="w-full flex gap-4">
          <div className="w-full flex flex-col">
            <input
              type={'date'}
              placeholder={placeholder}
              disabled={disabled}
              {...register(name1, validators)}
              className=" w-full p-3 border border-cinza disabled:bg-cinza rounded-md text-xl"
              {...props}
            />
            {errors?.[name1]?.type === "required" && (
              <span className="text-laranja">Data obrigatório</span>
            )}
          </div>
          <div className="w-full flex flex-col">
            <input
              type={'time'}
              placeholder={placeholder}
              disabled={disabled}
              {...register(name2, validators)}
              className="p-3 w-full border border-cinza disabled:bg-cinza rounded-md text-xl"
              {...props}
            />
            {errors?.[name2]?.type === "required" && (
              <span className="text-laranja">Hora obrigatório</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeInput;
