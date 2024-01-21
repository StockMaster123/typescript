import { getDate } from "./getDate"

export const getHour = (dateTime:any) => {

    interface Hour{
      hour:string,
      active: boolean
    }

    const dateFormat = getDate()
      let arrayHour:any = []
      let Hour:number = new Date().getHours() + 1
        if ( dateTime == dateFormat ) {
          for (let hour:number = Hour; hour <= 17; hour++) {
            arrayHour.push({hour:`${hour}:00`, active:false })
          }
        }
        else {
          arrayHour = [{hour:'9:00', active:false}, {hour:'10:00', active:false}, {hour:'11:00', active:false}, {hour:'12:00', active:false}, {hour:'13:00', active:false}, {hour:'14:00', active:false}, {hour:'15:00', active:false}, {hour:'16:00', active:false}]
      }
  return arrayHour
  
}
