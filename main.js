const $ = (e) => document.getElementById(e)

const seg = new Intl.Segmenter('zh', { granularity: 'word' })
if (!seg) mdui.alert('浏览器，太屑，无法，进行分词')

function isASCII(str) {
  return !!str.match(/\w/)
}
function isPunc(str) {
  return !!str.match(/[~( ),.，。？！：“"';:!?”-]/)
}

$('input').oninput = (ev) => {
  const text = ev.target.value
  $('output').innerText = ''
  text.split('\n').forEach((val) => {
    const s = Array.from(seg.segment(val))

    let str = '',
      limit = 2
    for (let i = 0; i < s.length; ) {
      const word = s[i].segment,
        d = s[i].isWordLike
      i++
      if (isPunc(word)) continue
      str += word
      if (!isASCII(word)) {
        let len = word.length
        while (i < s.length) {
          const word = s[i].segment,
            d = s[i].isWordLike
          len += word.length
          if (len > limit || isASCII(word) || !d) break
          str += word
          i++
        }
        limit = limit == 2 ? 4 : 3
      } else limit = 4
      str += '，'
    }

    $('output').innerText += str.slice(0, -1) + '\n'
  })
}

$('output').onclick = $('output').ontouchstart = () => {
  navigator.clipboard.writeText($('output').textContent).then(() => {
    mdui.snackbar('复制，成功了')
  })
}
