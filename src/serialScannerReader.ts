import { SerialPort } from "serialport"
import { ReadlineParser } from "@serialport/parser-readline"

export const serialScannerReader = (serialPort: string, onEAN: (eanCode: string) => Promise<void>) => {
  const parser = new ReadlineParser({ delimiter: "\r\n" })

  const setupPort = () => {
    const port = new SerialPort({
      path: serialPort,
      baudRate: 115200,
      autoOpen: true,
    })
    port.pipe(parser)

    port.on("error", (err) => {
      console.error("Serial port error: ", err)
    })

    return port
  }

  const port = setupPort()

  parser.on("data", (data) => {
    onEAN(data)
  })

  return port
}
