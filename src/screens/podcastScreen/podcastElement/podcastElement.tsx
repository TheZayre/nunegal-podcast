import { IPodcastElement } from 'types/interfaces';
import './podcastelement.scss'
export default function PodcastElement(props : IPodcastElement) {

  return (
    <div className={'podcast-element-content'} onClick={()=>{ if(props?.onClick) props?.onClick() }}>
        <img className={'podcast-image'} src={props?.image}></img>
        <div className={'podcast-title'}>{props?.title}</div>
        <div className={'podcast-author'}>{`Author: ${props?.author}`}</div>
    </div>
  );
}