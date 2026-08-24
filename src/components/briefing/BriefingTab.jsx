import { pillars } from '../../data/index.js'
import PillarCard from './PillarCard.jsx'
import ReferenceGallery from './ReferenceGallery.jsx'

export default function BriefingTab() {
  return (
    <div className="panel">
      <section className="intro-block">
        <h2>O que estamos construindo</h2>
        <p>
          Um Instagram com identidade de <b>cervejaria artesanal</b> pra Hops Beer, com o objetivo de{' '}
          <b>fortalecer marca e reconhecimento no bairro</b>, virando referência de "onde beber uma boa
          cerveja por perto" antes de virar canal de conversão direta.
        </p>
        <p>
          Regra de marca: preto e dourado (as cores do logo) precisam aparecer em algum elemento de cada
          post, seja moldura, overlay de texto ou tipografia. É o ponto fraco mais comum em cervejarias
          artesanais, o feed vira uma sequência de rótulos com cores próprias e ninguém reconstrói o logo
          só olhando o grid. Aqui a cor do produto pode variar, a cor da marca não desaparece.
        </p>
        <p>
          Cadência enxuta de <b>4 posts por semana</b>, sempre nos mesmos dias (segunda, quarta, sexta e
          domingo), pra manter consistência sem exigir captação toda semana. Produto é fixo toda quarta,
          Música ao vivo é fixo toda sexta; Experiência, Bastidores, Institucional, Gastronomia e
          Educacional dividem o domingo, girando em ciclo de 5 semanas.
        </p>
      </section>

      <section>
        <h2>Pilares de conteúdo</h2>
        <div className="pillars-grid">
          {pillars.map((p) => (
            <PillarCard key={p.id} pillar={p} />
          ))}
        </div>
      </section>

      <ReferenceGallery />

      <section>
        <h2>Formatos e cadência</h2>
        <div className="format-grid">
          <div className="format-card format-card--fixado">
            <span className="format-num">1×</span>
            <h3>Segunda · Fixado</h3>
            <p>Programação da semana, trocada e fixada no topo do perfil. Precisa de captação/arte própria, não é reaproveitamento dos outros pilares.</p>
          </div>
          <div className="format-card">
            <span className="format-num">1×</span>
            <h3>Quarta · Produto</h3>
            <p>Chopp, rótulo ou lineup da semana, sempre no mesmo dia, sem alternância.</p>
          </div>
          <div className="format-card">
            <span className="format-num">1×</span>
            <h3>Sexta · Música ao vivo</h3>
            <p>Post de aviso do evento da noite, captado durante o próprio evento, não na visita diurna.</p>
          </div>
          <div className="format-card">
            <span className="format-num">1×</span>
            <h3>Domingo · Rotativo</h3>
            <p>Experiência, Bastidores, Institucional, Gastronomia ou Educacional, um por semana, em ciclo de 5 semanas.</p>
          </div>
          <div className="format-card">
            <span className="format-num">1×</span>
            <h3>Captação / mês</h3>
            <p>Uma visita cobre as semanas de segunda/quarta/domingo do mês, mais a sessão noturna dos eventos de sexta. Executado por fotógrafo/social media dedicado.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
