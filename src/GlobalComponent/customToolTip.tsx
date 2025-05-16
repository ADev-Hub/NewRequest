import * as React from "react";
import {
  Label,
  makeStyles,
  mergeClasses,
  tokens,
  Tooltip,
  useId,
} from "@fluentui/react-components";
import type { TooltipProps } from "@fluentui/react-components";
import { BsInfoCircle } from "react-icons/bs";
const useStyles = makeStyles({
  root: {
    display: "flex",
    columnGap: tokens.spacingVerticalS,
  },
  visible: {
    color: tokens.colorNeutralForeground2BrandSelected,
  },
});

export const CustomToolTip = (props: any) => {
  const styles = useStyles();
  const contentId = useId("content");
  const [visible, setVisible] = React.useState(false);

  return (
<>{props?.customIcon ==true ?  <span aria-owns={visible ? contentId : undefined} className={`${styles.root} InfoTooltip CustomTooltip`}>
   <Tooltip
     content={{
      children:  <span>
      {props?.richText == true ? <span dangerouslySetInnerHTML={{ __html: props?.Description }}></span>: props?.Description}
    </span>
    , id: contentId,
       className: "custom-tooltip",
     }}
     withArrow
     relationship="label"
     onVisibleChange={(e: any, data: any) => setVisible(data?.visible)}
     >
     <span tabIndex={0} dangerouslySetInnerHTML={{__html:props?.icon}} className={mergeClasses(visible && styles.visible)}>
     </span>
   </Tooltip>

   

 </span>: <span aria-owns={visible ? contentId : undefined} className={`${styles.root} InfoTooltip CustomTooltip`}>
 <Tooltip
   content={{
     children:  <span>
     {props?.richText == true ? <span dangerouslySetInnerHTML={{ __html: props?.Description }}></span>: props?.Description}
   </span>, id: contentId
   }}
   withArrow
   relationship="label"
   onVisibleChange={(e: any, data: any) => setVisible(data?.visible)}
   >
   <span tabIndex={0} className={mergeClasses(visible && styles.visible)}>
   <BsInfoCircle />
   </span>
 </Tooltip>

 

</span>}</>
   

  );
};