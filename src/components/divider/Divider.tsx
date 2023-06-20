import { IDivider } from 'types/interfaces';
import './divider.scss'
export default function Divider(props : IDivider) {

  return (
    <div className={`divider ${props?.className}`}/>
  );
}

