export default function Header({image, name,date, partySize}:{image:string, name:string, date:string, partySize:string}) {
  const [day, time] = date.split("T")
  const d = new Date(date)
  return (
    <div>
      <h3 className="font-bold">You're almost done!</h3>
      <div className="mt-5 flex">
        <img
          src={image}
          alt=""
          className="w-32 h-18 rounded"
        />
        <div className="ml-4">
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="flex mt-3">
            <p className="mr-6">{day}</p>
            <p className="mr-6">{formatTime(time)}</p>
            <p className="mr-6">{partySize} people</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const formatTime = (time:string) =>{
  const split = time.split(":")
  const hour = split[0]
  const minute = split[1]
  let amOrPm = "AM"
  if(parseInt(hour) > 11){
    amOrPm = "PM"
  }
  return `${hour}: ${minute}  ${amOrPm}`
}