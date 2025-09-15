import React from "react";


const maskDocumento = (type:string,value) => {
  const numbers = value.replace(/\D/g,'')
  
  if(type === 'cpf'){
    let cpf = numbers
    
    cpf = cpf.replace(/(\d{3})(\d{3})/,"$1.$2")
    cpf = cpf.replace(/(\d{3})(\d{3})/,"$1.$2")
    cpf = cpf.replace(/(\d{3})(\d{2})/,"$1-$2")
    return cpf
  }else if (type === 'telefone'){
    let telefone = numbers
    
    telefone = telefone.replace(/(\d{2})(\d{4,5})/,"$1 $2")
    telefone = telefone.replace(/(\d{4,5})(\d{4})/,"$1-$2")
    return telefone
  }
}

const Input = ({
  name,
  label,
  placeholder='',
  maxLength = 255,
  type = "text",
  validators={},
  register,
  disabled = false,
  errors,
  options = [],
  chave='',
  valor='',
  mask = '',
  style={},
  onChange = (e:any) => {},
  defaultValue=0,
  defaultText='Selecione',
  ...props
}) => {

  return (
    <div className="grid gap-2">
      <div className="grid gap-4">
        <label className="capitalize text-2xl font-semibold" htmlFor={name}>
          {label}
        </label>
        {type !== "select" && type !== 'textarea' &&  mask===''   && (
          <input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            style={style && style}
            {...register(name, validators)}
            className="p-3 border border-cinza disabled:bg-cinza rounded-md text-xl"
            {...props}
          />
        )}
        {type === "textarea" &&  mask===''   && (
          <textarea
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            rows={5}
            {...register(name, validators)}
            className="p-3 resize-none border border-cinza disabled:bg-cinza rounded-md text-xl"
            {...props}
          />
        )}
        {type !== "select" && mask!= '' && (
          <input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            {...register(name,{...validators,onChange:(e) => e.target.value = maskDocumento(mask,e.target.value)})}
            className="p-3 border border-cinza disabled:bg-cinza rounded-md text-xl"
            {...props}
            />
          )}
        {type === "select" && (
          <select
          {...register(name, validators)}
          disabled={disabled}
          className="p-3 border border-cinza disabled:bg-cinza rounded-md text-xl"
          onChange={({target}) => onChange(target.value)}
          defaultValue={defaultValue}
          >
            <option value={defaultValue} disabled>{defaultText}</option>
            {options && options.map(o => 
              <option  defaultValue={0} key={o[chave]} value={o[chave]}>
                  {`${o[chave]} - ${o[valor]}`}
              </option>
            )}
          </select>
        )}
      </div>
      {errors?.[name]?.type === "required" && (
        <span className="text-laranja">{label} obrigatório</span>
      )}
      {errors?.[name]?.type === "maxLength" && (
        <span className="text-laranja">
          {label} deve ter no máximo {maxLength} caracteres
        </span>
      )}
    </div>
  );
};

export default Input;
