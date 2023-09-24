/* 
  Проверка на имя котрое должно начинаться с большой буквы
  может быть многосоставным, но должно быть разделено через тире

    Евгений = true
    евгений = false
    ЕвГений = false
    Анна-Мария = true
    Анна-Мария- = false
    анна-Мария = false
    Анна-Мария-Длинная = true
*/
export const nameRegex = /^([\p{Lu}][\p{Ll}]*(?:-[\p{Lu}][\p{Ll}]*)?)+$/u;