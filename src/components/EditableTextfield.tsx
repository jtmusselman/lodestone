import { faFloppyDisk, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import AutoGrowInput from './AutoGrowInput';

export type TextfieldType = 'heading' | 'description';

type Props = {
  initialText: string;
  type?: TextfieldType;
  containerClassName?: string;
  textClassName?: string;
  iconClassName?: string;
  placeholder?: string;
  onSubmit: (arg: string) => { error: boolean; message: string };
};

export default function EditableTextfield({
  initialText,
  type = 'heading',
  containerClassName = '',
  textClassName = '',
  iconClassName = '',
  placeholder = '',
  onSubmit,
}: Props) {
  const [displayText, setDisplayText] = useState<string>(initialText);
  const [editText, setEditText] = useState<string>(initialText);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentText = e.target.value;
    setEditText(currentText);
  };

  const onSave = async () => {
    setIsLoading(true);
    const trimmedText = editText.trim();
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    try {
      const { error, message } = await onSubmit(trimmedText);
      setErrorStatus(error);
      if (error) {
        setErrorMessage(message);
        setIsEditing(true);
      } else {
        setIsEditing(false);
        setDisplayText(trimmedText);
        setEditText(trimmedText);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    if(isLoading) return;
    setEditText(displayText);
    setIsEditing(false);
    setErrorStatus(false);
    setErrorMessage('');
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if(!isEditing) return;
      if (e.code === 'Enter') {
        onSave();
      } else if (e.code === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  });

  const errorNode = errorStatus ? (
    <div
      className={`absolute whitespace-nowrap text-right font-sans not-italic text-red ${
        type === 'heading'
          ? 'text-base font-normal tracking-normal -top-[1.5em]'
          : 'text-smaller -bottom-[1.3em]'
      }`}
    >
      {errorMessage}
    </div>
  ) : null;

  const iconSize = type === 'heading' ? 'w-8' : 'w-4';

  return (
    <div
      className={`relative flex flex-row justify-start items-center tracking-tight group ml-[-0.25ch] ${
        type === 'heading' ? 'font-semibold font-heading text-2xlarge gap-4' : 'italic text-small font-medium gap-2'
      } ${containerClassName}`}
    >
      {isEditing ? (
        <AutoGrowInput
          className={`
          ${type === 'heading' ? 'rounded-lg' : 'rounded'} 
          ${errorStatus ? `border-2 border-red -my-0.5 -ml-1 -mr-0.5` : '-ml-0.5'}`}
          textClassName={`focus:outline-none tracking-tight bg-transparent text-gray-300 ${textClassName}`}
          value={editText}
          onChange={onEdit}
          onBlur={onCancel}
          autoFocus={true}
          placeholder={placeholder}
        ></AutoGrowInput>
      ) : (
        <div
          className={`
          ${type === 'heading' ? 'rounded-lg text-gray-300' : 'rounded text-gray-500'} 
          ${errorStatus ? `border-2 border-red -my-0.5 -ml-1 -mr-0.5` : '-ml-0.5'}
          bg-transparent hover:text-gray-300 truncate group-hover:underline ${textClassName}`}
          onClick={() => {
            setIsEditing(true);
          }}
        >
          <span className={`px-[0.25ch] whitespace-pre tracking-tight bg-transparent`}>{displayText ? displayText : placeholder}</span>
        </div>
      )}
      {errorNode}
      {isLoading ? (
        <BeatLoader
          size={`${type === 'heading' ? '0.5rem' : '0.25rem'}`}
          cssOverride={{
            width: `${type === 'heading' ? '3rem' : '2rem'}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: `0 -0.5rem`,
          }}
          color="#6b7280"
        />
      ) : (
        <FontAwesomeIcon
          className={`text-gray-faded/30 group-hover:text-gray-500 hover:cursor-pointer ${iconSize} ${iconClassName}`}
          icon={isEditing ? faFloppyDisk : faPenToSquare}
          onMouseDown={(e) => {
            if (isEditing) e.preventDefault();
          }}
          onClick={() => {
            if (isEditing) {
              onSave();
            } else {
              setIsEditing(true);
            }
          }}
        />
      )}
    </div>
  );
}
