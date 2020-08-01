import { format } from 'date-fns';
import { filter, cloneDeep, map } from 'lodash';
import { parse } from 'url';

const generateDummy = total => {
  const now = new Date();
  const result = [];
  const sample = [
    {
      title: '吾輩は猫である',
      author: '夏目漱石',
      body:
        '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話である。しかしその当時は何という考もなかったから別段恐しいとも思わなかった。ただ彼の掌に載せられてスーと持ち上げられた時何だかフワフワした感じがあったばかりである。掌の上で少し落ちついて書生の顔を見たのがいわゆる人間というものの見始であろう。この時妙なものだと思った感じが今でも残っている。第一毛をもって装飾されべきはずの顔がつるつるしてまるで薬缶だ。その後猫にもだいぶ逢ったがこんな片輪には一度も出会わした事がない。のみならず顔の真中があまりに突起している。',
    },
    {
      title: '坊っちゃん',
      author: '夏目漱石',
      body:
        '親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。',
    },
    {
      title: '草枕',
      author: '夏目漱石',
      body:
        '山路を登りながら、こう考えた。智に働けば角が立つ。情に棹させば流される。意地を通せば窮屈だ。とかくに人の世は住みにくい。住みにくさが高じると、安い所へ引き越したくなる。どこへ越しても住みにくいと悟った時、詩が生れて、画が出来る。',
    },
    {
      title: 'セロ弾きのゴーシュ',
      author: '宮沢賢治',
      body:
        'やり直しは両手の司会狸団が猫にぶっつかっ専門ました。またどうだめましたってかっこうないで。元気ですたことますはんまた駒のくたくたたちのときへはどんと変たたて、これまで音を飛びられるんたた。込みすぎこれは舞台から面白まして元来の猫の狩たちをある第一赤汁のびっくりにしていました。下は一生けん命出しがくださいござい。手は万落ち野ねずみのように戻っながらてるた。先生も箱羽とおれをして行きた。狸も狸をどんどんにつかまえてゴーシュが舞台のようへひいてこどもになるてどうも足に困るて行っだ。',
    },
    {
      title: 'ポラーノの広場',
      author: '宮沢賢治',
      body:
        'あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。',
    },
  ];

  let history = sample.length;
  let day = 0;
  for (let i = 1; i <= total; i += 1) {
    // get sample
    const pointer = (() => {
      let result;
      do {
        result = Math.floor(Math.random() * (sample.length - 1));
      } while (result === history);
      return +result;
    })();
    history = pointer;
    result.push({
      id: `0000000000${i}`.slice(-6),
      update: format(
        cloneDeep(now).setDate(cloneDeep(now).getDate() - day),
        'yyyy-MM-dd'
      ),
      title: sample[pointer].title,
      body: sample[pointer].body,
      author: sample[pointer].author,
      img: `https://placehold.jp/800x600.png?text=photo_${`0000000000${i}`.slice(
        -3
      )}`,
    });

    day += Math.floor(Math.random() * 5 + 1);
  }
  return result;
};

// generate
const db = generateDummy(36);

export default function (req, res, next) {
  // req は Node.js の HTTPリクエストオブジェクトです
  const parsedUrl = parse(req.url, true);
  const params = parsedUrl.query;
  let records = db;

  // res は Node.js の HTTPレスポンスオブジェクトです
  const makeResponse = () => {
    if (params) {
      // page
      const page = +params.page < 0 || !params.page ? 1 : +params.page;
      const max = +params.max < 1 || !params.max ? 1 : +params.max;
      const start = (page - 1) * max;

      // condition filter
      const filterParams = params.condition
        ? JSON.parse(params.condition)
        : undefined;
      if (filterParams)
        // eslint-disable-next-line consistent-return
        records = filter(db, item => {
          let isValid = true;
          map(filterParams, (val, key) => {
            if (item[key] !== val) isValid = false;
          });
          if (isValid) return item;
        });

      return records.slice(start, start + max);
    } else return { message: 'error' };
  };

  try {
    res
      .writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      })
      .end(
        JSON.stringify({
          response: {
            page: params.page,
            total: records.length,
            records: makeResponse(),
            period: params.period || '',
          },
        })
      );
  } catch (err) {
    return res.status(400).json({
      error: {
        message: err.message,
      },
    });
  }

  // next は 次のミドルウェアを呼び出すための関数です。
  // あなたのミドルウェアが最後でない場合、関数の最後で next を呼び出すのを忘れないでください！
  next();
}
