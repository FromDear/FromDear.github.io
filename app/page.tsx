import Link from 'next/link';
import SnowEffect from '@/components/SnowEffect';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#FFFDF5]">
      <SnowEffect />

      {/* Warm Light Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-200/30 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-multiply"></div>

      {/* 히어로 섹션 */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* 메인 타이틀 */}
          <div className="mb-12 animate-float">
            <div className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm mb-6 border border-green-200 shadow-sm">
              🎄 크리스마스 D-7 카운트다운
            </div>
            <h1 className="text-7xl md:text-9xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-red-600 drop-shadow-sm tracking-tight">
              FromDear
            </h1>
            <p className="text-xl md:text-3xl text-gray-700 font-medium leading-relaxed text-balance">
              12월 19일부터 25일까지,<br />
              매일 도착하는 <span className="text-green-700 font-bold underline decoration-wavy decoration-red-300 underline-offset-4">마음의 선물</span>을 열어보세요.
            </p>
          </div>

          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Link
              href="/auth"
              className="group relative px-10 py-5 bg-red-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:bg-red-700 transition-all duration-300 text-xl overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                내 캘린더 만들기 🎁
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            <Link
              href="/auth"
              className="px-10 py-5 bg-green-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-green-800 transition-all duration-300 text-xl border border-green-600"
            >
              로그인하기 🎄
            </Link>
          </div>
        </div>

        {/* 하단 장식 */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </section>

      {/* 기능 소개 섹션 */}
      <section className="py-32 px-4 bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              특별한 일주일을 선물하세요
            </h2>
            <p className="text-xl text-gray-500">
              크리스마스를 기다리는 설렘, FromDear와 함께하세요.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* 카드 1 */}
            <div className="group bg-gray-50 rounded-3xl p-10 hover:bg-red-50 transition-colors duration-500 cursor-default">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">💌</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">익명 메시지</h3>
              <p className="text-gray-600 leading-relaxed">
                누가 보냈는지 모르게 마음을 전하세요.<br />
                솔직하고 따뜻한 진심이 전달됩니다.
              </p>
            </div>

            {/* 카드 2 */}
            <div className="group bg-gray-50 rounded-3xl p-10 hover:bg-green-50 transition-colors duration-500 cursor-default">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">📅</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">7일간의 카운트다운</h3>
              <p className="text-gray-600 leading-relaxed">
                12월 19일부터 25일까지.<br />
                매일 하나씩 선물 상자가 열립니다.
              </p>
            </div>

            {/* 카드 3 */}
            <div className="group bg-gray-50 rounded-3xl p-10 hover:bg-yellow-50 transition-colors duration-500 cursor-default">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">💝</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">선물 꾸러미</h3>
              <p className="text-gray-600 leading-relaxed">
                하루에 여러 개의 메시지가 와도 괜찮아요.<br />
                한 상자에 가득 담아 드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 text-center relative z-10">
        <p className="font-medium">© 2024 FromDear. Made with ❤️ for Christmas</p>
      </footer>
    </main>
  );
}
