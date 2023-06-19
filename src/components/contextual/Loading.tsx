import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import './loading.scss';
import { contextualInformationLoading } from '../../redux/slices/contextualSlice';
import React from 'react';
import { R } from '../../resources/R';

export default function Loading() {
  const contextualLoading = useSelector(contextualInformationLoading);


  return (
    contextualLoading ? <div className='content-loading'>
      <div className='loading'>
        <ClipLoader
          color={R.colors.neutral.black}
          speedMultiplier={0.5}
          size={30}
        />
        <div className='loading-text'>Cargando</div>
      </div>
      <div className='background'/>
    </div> : null
  );
}