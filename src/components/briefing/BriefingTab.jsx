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
          Cadência enxuta de <b>6 posts por semana</b>, em 5 dias (segunda, terça, quarta, sexta e
          domingo), pra manter consistência sem exigir captação toda semana. Segunda é só o fixado com a
          programação. Terça e sexta têm um post complementar que gira entre os pilares de conteúdo pra
          dar mais volume, e a sexta ainda leva o aviso de Música ao vivo — os dois complementares e a
          rotativa da semana sempre em pilares diferentes entre si. Quarta e domingo alternam a cada
          semana entre Produto (que entra toda semana, sem falta) e o pilar rotativo — Experiência,
          Bastidores, Institucional, Gastronomia e Educacional, girando em ciclo de 5 semanas.
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
            <h3>Terça · Complementar</h3>
            <p>Post girando entre os pilares de conteúdo (Educacional, Institucional, Experiência, Bastidores, Gastronomia) numa ordem defasada da rotativa da semana, pra não repetir assunto. Reaproveita o banco de captação do pilar.</p>
          </div>
          <div className="format-card">
            <span className="format-num">1×</span>
            <h3>Quarta/Domingo · Produto</h3>
            <p>Chopp, rótulo ou lineup da semana, entra toda semana sem falta, mas alternando entre quarta e domingo — não fica sempre no mesmo dia.</p>
          </div>
          <div className="format-card">
            <span className="format-num">1×</span>
            <h3>Sexta · Música ao vivo</h3>
            <p>Post de aviso do evento da noite, captado durante o próprio evento, não na visita diurna.</p>
          </div>
          <div className="format-card">
            <span className="format-num">1×</span>
            <h3>Sexta · Complementar</h3>
            <p>Segundo post do dia, girando entre os pilares de conteúdo numa ordem defasada da complementar de terça e da rotativa da semana, pra os três nunca caírem no mesmo assunto. Reaproveita o banco de captação do pilar.</p>
          </div>
          <div className="format-card">
            <span className="format-num">1×</span>
            <h3>Quarta/Domingo · Rotativo</h3>
            <p>Experiência, Bastidores, Institucional, Gastronomia ou Educacional, um por semana, em ciclo de 5 semanas — no dia (quarta ou domingo) que o Produto não estiver ocupando naquela semana.</p>
          </div>
          <div className="format-card">
            <span className="format-num">1×</span>
            <h3>Captação / mês</h3>
            <p>Uma visita cobre os posts diurnos do mês (terça/quarta/domingo + o complementar de sexta), mais a sessão noturna dos eventos de música de sexta. Executado por fotógrafo/social media dedicado.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
