export const zodiacAnimals = [
    'Chuột Ẩn Danh', 'Trâu Ẩn Danh', 'Hổ Ẩn Danh', 'Mèo Ẩn Danh',
    'Rồng Ẩn Danh', 'Rắn Ẩn Danh', 'Ngựa Ẩn Danh', 'Dê Ẩn Danh',
    'Khỉ Ẩn Danh', 'Gà Ẩn Danh', 'Chó Ẩn Danh', 'Heo Ẩn Danh'
]

export function getRandomZodiac() {
    return zodiacAnimals[Math.floor(Math.random() * zodiacAnimals.length)]
}