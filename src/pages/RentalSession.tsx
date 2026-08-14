import { ArrowRight, Camera, Check, ClipboardCheck, Fuel, MapPin } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'
import type { RentalSession } from '../types'

export function RentalSessionPage({ returnMode = false }: { returnMode?: boolean }) {
  const { state, saveRentalSession } = useAppState()
  const active = useMemo(() => state.memory.rental.sessions.find(item => item.status !== 'completed'), [state.memory.rental.sessions])
  const [vehicle, setVehicle] = useState(active?.vehicle ?? '大众 Golf · BER FD 508')
  const [location, setLocation] = useState(active?.location ?? 'Berlin Hauptbahnhof')
  const [mileage, setMileage] = useState(returnMode ? active?.pickupMileage ? active.pickupMileage + 86 : 21470 : 21384)
  const [energy, setEnergy] = useState(returnMode ? 78 : 92)
  const [photos, setPhotos] = useState<string[]>([])
  const [damage, setDamage] = useState<string[]>(active?.existingDamage ?? [])
  const [saved, setSaved] = useState(false)
  const toggle = (item: string) => setDamage(current => current.includes(item) ? current.filter(value => value !== item) : [...current, item])
  const commit = () => {
    const session: RentalSession = returnMode && active ? { ...active, returnMileage: mileage, returnEnergy: energy, returnDamage: damage, status: 'completed' } : { id: `rental-${Date.now()}`, vehicle, location, pickupMileage: mileage, pickupEnergy: energy, existingDamage: damage, insuranceConfirmed: true, documentsConfirmed: true, status: 'active', createdAt: new Date().toISOString() }
    saveRentalSession(session); setSaved(true)
  }
  return <AppShell><div className="rental-page page-frame"><header className="first-feature-hero"><div><span>RENTAL FULL LOOP</span><h1>{returnMode ? '归还时，与取车记录逐项对照。' : '取车时，先建立一份共同证据。'}</h1><p>照片、里程、能源、保险和已有损伤会保留在同一个 Rental Session。</p></div><ClipboardCheck /></header><section className="rental-session-form"><div className="rental-fields"><label><span>车辆</span><input value={vehicle} onChange={event => setVehicle(event.target.value)} /></label><label><MapPin /><span>地点</span><input value={location} onChange={event => setLocation(event.target.value)} /></label><label><span>{returnMode ? '归还里程' : '取车里程'}</span><input type="number" value={mileage} onChange={event => setMileage(Number(event.target.value))} /></label><label><Fuel /><span>油量 / 电量 %</span><input type="number" value={energy} onChange={event => setEnergy(Number(event.target.value))} /></label></div><div className="rental-evidence"><article><Camera /><strong>环车照片</strong><p>{photos.length} / 4 个方向</p><button onClick={() => setPhotos(current => current.length < 4 ? [...current, `photo-${current.length}`] : current)}>{photos.length < 4 ? '模拟拍摄一张' : '拍摄完成'}</button></article><article><ClipboardCheck /><strong>{returnMode ? '损伤对照' : '已有损伤'}</strong><div>{['左前轮毂划痕', '右后门轻微凹点', '前挡风玻璃完好'].map(item => <button key={item} className={damage.includes(item) ? 'active' : ''} onClick={() => toggle(item)}>{damage.includes(item) ? <Check /> : null}{item}</button>)}</div></article></div><button className="rental-save" disabled={photos.length < 4 || saved} onClick={commit}>{saved ? <><Check />已写入 Vehicle Memory</> : returnMode ? '完成归还并关闭 Session' : '建立 Rental Session'}</button></section>{!returnMode && saved ? <Link className="rental-next" to="/rental/return">模拟归还流程 <ArrowRight /></Link> : null}</div></AppShell>
}
