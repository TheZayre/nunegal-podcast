import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './contextualmessage.scss';
import { R } from '../../resources/R';
import { contextualInformationMessage } from '../../redux/slices/contextualSlice';

export default function ContextualMessage() {
  const contextual = useSelector(contextualInformationMessage);
  const [show, setShow] = useState(false);
  const [color, setColor] = useState({
    background: R.colors.contextual.success.trazo,
    icon: R.colors.contextual.success.masa,
    text: R.colors.contextual.success.text,
  });

  useEffect(()=>{
    if(contextual.message?.length) {
      setShow(true);
      switch (contextual.type) {
        case 'success':
          setColor({
            background: R.colors.contextual.success.trazo,
            icon: R.colors.contextual.success.original,
            text: R.colors.contextual.success.text,
          });
          break;
        case 'error':
          setColor({
            background: R.colors.contextual.error.trazo,
            icon: R.colors.contextual.error.original,
            text: R.colors.contextual.error.text,
          });
          break;
        case 'warning':
          setColor({
            background: R.colors.contextual.warning.trazo,
            icon: R.colors.contextual.warning.original,
            text: R.colors.contextual.warning.text,
          });
          break;
      }
      setTimeout(() => {
        setShow(false);
      }, 5000);
    }
  },[contextual]);

  return (
    show
      ? <div className='content-contextual'>
        <div className='contextual' style={{ backgroundColor:color.background }}>
          <div className='contextual-text' style={{ color:color.text }}>{contextual.message}</div>
        </div>
      </div>
      : null
  );
}