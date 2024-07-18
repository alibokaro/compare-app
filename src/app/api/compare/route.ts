import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file1: File | null = data.get('file1') as unknown as File
  const file2: File | null = data.get('file2') as unknown as File

  if (!file1 || !file2) {
    return NextResponse.json({ success: false, message: 'Both files must be provided' })
  }

  try {
    const [content1, content2] = await Promise.all([file1.text(), file2.text()]) // Read both files' content concurrently

    const parseContent = (content: string) => {
      const lines = content.split('\n') // Split the content by new lines
      const keyValuePairs: { [key: string]: string } = {}

      lines.forEach(line => {
        const [key, value] = line.split(':')
        if (key && value) {
          keyValuePairs[key.trim()] = value.trim() // Trim to remove any extra whitespace
        }
      })

      return keyValuePairs
    }

    const data1 = parseContent(content1)
    const data2 = parseContent(content2)

    const differences: { [key: string]: { file1?: string, file2?: string } } = {}

    // Find keys present in file1 but not in file2, and keys with different values
    for (const key in data1) {
      if (data1[key] !== data2[key]) {
        differences[key] = { file1: data1[key], file2: data2[key] }
      }
    }

    // Find keys present in file2 but not in file1
    for (const key in data2) {
      if (!(key in data1)) {
        differences[key] = { file1: undefined, file2: data2[key] }
      }
    }

    return NextResponse.json({ success: true, differences }) // Return the differences as part of the response
  } catch (error) {
    console.error('Error reading the files:', error)
    return NextResponse.json({ success: false, message: 'Error reading the files' })
  }
}
