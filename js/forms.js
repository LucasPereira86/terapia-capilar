/**
 * Adriele Tratamento Capilar
 * Forms Handler
 */

// Storage keys
const STORAGE_KEYS = {
    clients: 'adriele_clients',
    anamneses: 'adriele_anamneses'
};

// Initialize forms
document.addEventListener('DOMContentLoaded', () => {
    initAvaliacaoForm();
    initAnamneseForm();
});

// =====================================================
// FICHA DE AVALIAÇÃO
// =====================================================

function initAvaliacaoForm() {
    const form = document.getElementById('avaliacaoForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveAvaliacao(form);
    });

    // CEP mask and auto-fill
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;

            // Auto-fill address when CEP is complete (8 digits)
            if (value.replace('-', '').length === 8) {
                buscarCEP(value.replace('-', ''));
            }
        });
    }

    // Phone masks
    ['celular', 'fixoResidencial', 'fixoComercial'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = '(' + value;
                }
                if (value.length > 3) {
                    value = value.substring(0, 3) + ') ' + value.substring(3);
                }
                if (value.length > 10) {
                    value = value.substring(0, 10) + '-' + value.substring(10, 14);
                }
                e.target.value = value;
            });
        }
    });
}

function saveAvaliacao(form) {
    const formData = new FormData(form);
    const data = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        type: 'avaliacao',
        // Dados do Cliente
        nome: formData.get('nome'),
        nascimento: formData.get('nascimento'),
        estadoCivil: formData.get('estadoCivil'),
        endereco: formData.get('endereco'),
        cep: formData.get('cep'),
        bairro: formData.get('bairro'),
        municipio: formData.get('municipio'),
        uf: formData.get('uf'),
        celular: formData.get('celular'),
        fixoResidencial: formData.get('fixoResidencial'),
        fixoComercial: formData.get('fixoComercial'),
        email: formData.get('email'),
        profissao: formData.get('profissao'),
        // Terapeuta
        terapeuta: formData.get('terapeuta'),
        // Avaliação do Problema
        queixaPrincipal: formData.get('queixaPrincipal'),
        acometeOutras: formData.get('acometeOutras'),
        quaisAreas: formData.get('quaisAreas'),
        fazQuantoTempo: formData.get('fazQuantoTempo'),
        problemaStatus: formData.get('problemaStatus'),
        cabeloStatus: formData.get('cabeloStatus'),
        alteracoes: formData.getAll('alteracoes'),
        outrasCrises: formData.get('outrasCrises'),
        quandoCrises: formData.get('quandoCrises'),
        // Histórico Pessoal
        doencasRecentes: formData.get('doencasRecentes'),
        doencaAtual: formData.get('doencaAtual'),
        qualDoenca: formData.get('qualDoenca'),
        problemaEndocrino: formData.get('problemaEndocrino'),
        qualEndocrino: formData.get('qualEndocrino'),
        cardiaco: formData.get('cardiaco'),
        marcapasso: formData.get('marcapasso'),
        medicacao: formData.get('medicacao'),
        qualMedicacao: formData.get('qualMedicacao'),
        antecedentes: formData.getAll('antecedentes'),
        alergia: formData.get('alergia'),
        qualAlergia: formData.get('qualAlergia'),
        temFilhos: formData.get('temFilhos'),
        quantosFilhos: formData.get('quantosFilhos'),
        dataUltimaGravidez: formData.get('dataUltimaGravidez'),
        gravidezPiorou: formData.get('gravidezPiorou'),
        comeCarne: formData.get('comeCarne'),
        alteracaoMenstrual: formData.get('alteracaoMenstrual'),
        qualAlteracaoMenstrual: formData.get('qualAlteracaoMenstrual'),
        historiaFamiliar: formData.get('historiaFamiliar'),
        familiaCalvicie: formData.get('familiaCalvicie')
    };

    // Save to localStorage
    const clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.clients) || '[]');
    clients.push(data);
    localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients));

    // Show success message
    showToast('Ficha de Avaliação salva com sucesso!', 'success');

    // Reset form
    form.reset();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =====================================================
// CEP LOOKUP (ViaCEP API)
// =====================================================

async function buscarCEP(cep) {
    try {
        // Show loading indicator
        const cepInput = document.getElementById('cep');
        if (cepInput) {
            cepInput.style.borderColor = '#f0c14b';
        }

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            showToast('CEP não encontrado!', 'error');
            return;
        }

        // Fill address fields
        const fields = {
            'endereco': data.logradouro || '',
            'bairro': data.bairro || '',
            'municipio': data.localidade || '',
            'uf': data.uf || ''
        };

        for (const [id, value] of Object.entries(fields)) {
            const input = document.getElementById(id);
            if (input) {
                input.value = value;
                // Highlight filled field
                input.style.backgroundColor = '#f0fff0';
                setTimeout(() => {
                    input.style.backgroundColor = '';
                }, 1500);
            }
        }

        if (cepInput) {
            cepInput.style.borderColor = '#4CAF50';
            setTimeout(() => {
                cepInput.style.borderColor = '';
            }, 1500);
        }

        showToast('Endereço preenchido automaticamente!', 'success');

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        showToast('Erro ao buscar CEP. Verifique sua conexão.', 'error');
    }
}

// =====================================================
// ANAMNESE CAPILAR
// =====================================================

function initAnamneseForm() {
    const form = document.getElementById('anamneseForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveAnamnese(form);
    });
}

function saveAnamnese(form) {
    const formData = new FormData(form);
    const data = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        type: 'anamnese',
        // Dados Básicos
        nomeCliente: formData.get('nomeCliente'),
        idade: formData.get('idade'),
        // Tricologia
        tipoRacial: formData.get('tipoRacial'),
        curvatura: formData.get('curvatura'),
        pigmentacao: formData.get('pigmentacao'),
        caracteristica: formData.get('caracteristica'),
        // Haste Capilar
        porosidade: formData.get('porosidade'),
        resistencia: formData.get('resistencia'),
        elasticidade: formData.get('elasticidade'),
        densidade: formData.get('densidade'),
        textura: formData.get('textura'),
        // Química
        quimica: formData.getAll('quimica'),
        quimOutros: formData.get('quimOutros'),
        // Técnicas de Pentear
        tecnicas: formData.getAll('tecnicas'),
        tecOutros: formData.get('tecOutros'),
        // Hábitos de Higiene
        higiene: formData.getAll('higiene'),
        lavagem: formData.get('lavagem'),
        higOutros: formData.get('higOutros'),
        // Hábitos Alimentares
        alimentacao: formData.getAll('alimentacao'),
        liquidos: formData.get('liquidos'),
        // Cuidados
        fazQuimica: formData.get('fazQuimica'),
        qualQuimica: formData.get('qualQuimica'),
        usaAcessorios: formData.getAll('usaAcessorios'),
        frequenciaLava: formData.get('frequenciaLava'),
        produtosUso: formData.get('produtosUso'),
        // Exame Físico
        volumeIgual: formData.get('volumeIgual'),
        comprimentoIgual: formData.get('comprimentoIgual'),
        tipoQuimica: formData.get('tipoQuimica'),
        cabelosSao: formData.getAll('cabelosSao'),
        qualQuim: formData.get('qualQuim'),
        pontas: formData.get('pontas'),
        regioesDanificadas: formData.get('regioesDanificadas'),
        couro: formData.getAll('couro'),
        presenca: formData.getAll('presenca'),
        retracoesRegioes: formData.get('retracoesRegioes'),
        // Alopecia
        alopLocalizacao: formData.get('alopLocalizacao'),
        alopNumLesoes: formData.get('alopNumLesoes'),
        alopFormato: formData.get('alopFormato'),
        alopTamanho: formData.get('alopTamanho'),
        superficieCouro: formData.get('superficieCouro'),
        reposicao: formData.get('reposicao'),
        observacaoComplementar: formData.get('observacaoComplementar'),
        // Conclusão
        alteracaoEncontrada: formData.get('alteracaoEncontrada'),
        protocoloSugerido: formData.get('protocoloSugerido'),
        // Termo
        aceitoTermo: formData.get('aceitoTermo'),
        dataAssinatura: formData.get('dataAssinatura'),
        assinaturaCliente: formData.get('assinaturaCliente'),
        assinaturaProfissional: formData.get('assinaturaProfissional')
    };

    // Save to localStorage
    const anamneses = JSON.parse(localStorage.getItem(STORAGE_KEYS.anamneses) || '[]');
    anamneses.push(data);
    localStorage.setItem(STORAGE_KEYS.anamneses, JSON.stringify(anamneses));

    // Show success message
    showToast('Anamnese Capilar salva com sucesso!', 'success');

    // Reset form
    form.reset();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =====================================================
// UTILITIES
// =====================================================

function limparFormulario() {
    if (confirm('Tem certeza que deseja limpar todos os campos?')) {
        const form = document.querySelector('form');
        if (form) {
            form.reset();
            showToast('Formulário limpo com sucesso!', 'warning');
        }
    }
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️'
    };

    toast.innerHTML = `
        <span>${icons[type] || '✅'}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Export functions for global access
window.limparFormulario = limparFormulario;
window.showToast = showToast;

// =====================================================
// PRINT AND PDF FUNCTIONS
// =====================================================

/**
 * Print the current form
 * Works for both Avaliação and Anamnese forms
 */
function imprimirFormulario() {
    // Get client name for title
    const nomeInput = document.getElementById('nome') || document.getElementById('nomeCliente');
    const clienteName = nomeInput ? nomeInput.value || 'Cliente' : 'Cliente';

    // Get form type
    const isAnamnese = !!document.getElementById('anamneseForm');
    const formType = isAnamnese ? 'Anamnese Capilar' : 'Ficha de Avaliação';

    // Set document title for print
    const originalTitle = document.title;
    document.title = `${formType} - ${clienteName}`;

    // Show toast before print
    showToast('Preparando impressão...', 'success');

    // Trigger print dialog
    setTimeout(() => {
        window.print();
        document.title = originalTitle;
    }, 500);
}

/**
 * Save the form as PDF using browser's print to PDF feature
 * Opens the print dialog where user can choose "Save as PDF"
 */
function salvarPDF() {
    // Get client name
    const nomeInput = document.getElementById('nome') || document.getElementById('nomeCliente');
    const clienteName = nomeInput ? nomeInput.value || 'Cliente' : 'Cliente';

    // Get form type
    const isAnamnese = !!document.getElementById('anamneseForm');
    const formType = isAnamnese ? 'Anamnese_Capilar' : 'Ficha_Avaliacao';

    // Format date
    const today = new Date().toISOString().split('T')[0];

    // Set suggested filename via document title
    const suggestedName = `${formType}_${clienteName.replace(/\s+/g, '_')}_${today}`;
    const originalTitle = document.title;
    document.title = suggestedName;

    showToast('Para salvar como PDF: escolha "Salvar como PDF" na impressora', 'success');

    setTimeout(() => {
        window.print();
        document.title = originalTitle;
    }, 500);
}

/**
 * Preview print layout
 * Opens a new window with print-optimized view
 */
function visualizarImpressao() {
    // Get form container
    const formContainer = document.querySelector('.form-container');
    if (!formContainer) {
        showToast('Formulário não encontrado', 'error');
        return;
    }

    // Get form info
    const nomeInput = document.getElementById('nome') || document.getElementById('nomeCliente');
    const clienteName = nomeInput ? nomeInput.value || 'Cliente' : 'Cliente';
    const isAnamnese = !!document.getElementById('anamneseForm');
    const formType = isAnamnese ? 'Anamnese Capilar' : 'Ficha de Avaliação';

    // Create print preview window
    const printWindow = window.open('', '_blank');

    // Get current date
    const today = new Date().toLocaleDateString('pt-BR');

    // Clone form content
    const formContent = formContainer.cloneNode(true);

    // Remove action buttons from clone
    const actionsToRemove = formContent.querySelectorAll('.form-actions, .no-print');
    actionsToRemove.forEach(el => el.remove());

    // Build print preview HTML
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${formType} - ${clienteName}</title>
            <link rel="stylesheet" href="css/styles.css">
            <style>
                body {
                    background: white;
                    padding: 2cm;
                    font-size: 11pt;
                }
                .print-header {
                    display: block !important;
                    text-align: center;
                    margin-bottom: 1cm;
                    padding-bottom: 0.5cm;
                    border-bottom: 2px solid #6B2D3C;
                }
                .print-header img {
                    width: 150px;
                    height: auto;
                    margin-bottom: 0.5cm;
                }
                .print-header h1 {
                    font-size: 18pt;
                    color: #6B2D3C;
                    margin: 0;
                    font-family: 'Playfair Display', Georgia, serif;
                }
                .print-header p {
                    font-size: 10pt;
                    color: #666;
                    margin: 0.2cm 0 0 0;
                }
                .form-container {
                    box-shadow: none;
                    padding: 0;
                    max-width: 100%;
                }
                .print-footer {
                    display: block !important;
                    margin-top: 1.5cm;
                    padding-top: 0.5cm;
                    border-top: 1px solid #ddd;
                    text-align: center;
                    font-size: 8pt;
                    color: #666;
                }
                .print-signature {
                    display: flex !important;
                    justify-content: space-between;
                    margin-top: 2cm;
                }
                .print-signature-line {
                    width: 40%;
                    text-align: center;
                    border-top: 1px solid #000;
                    padding-top: 0.3cm;
                    font-size: 9pt;
                }
                .print-actions {
                    position: fixed;
                    top: 1cm;
                    right: 1cm;
                    display: flex;
                    gap: 0.5cm;
                    z-index: 1000;
                }
                .print-actions button {
                    padding: 0.5cm 1cm;
                    font-size: 10pt;
                    cursor: pointer;
                    border: none;
                    border-radius: 5px;
                    font-weight: bold;
                }
                .btn-print-now {
                    background: #4A9B7F;
                    color: white;
                }
                .btn-close-preview {
                    background: #C75050;
                    color: white;
                }
                @media print {
                    .print-actions {
                        display: none !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-actions">
                <button class="btn-print-now" onclick="window.print()">🖨️ Imprimir / PDF</button>
                <button class="btn-close-preview" onclick="window.close()">✖ Fechar</button>
            </div>
            
            <div class="print-header">
                <img src="images/logo.png" alt="Adriele Terapia Capilar">
                <h1>${formType}</h1>
                <p>Adriele Terapia Capilar • ${today}</p>
            </div>
            
            ${formContent.innerHTML}
            
            <div class="print-signature">
                <div class="print-signature-line">
                    Assinatura do Cliente
                </div>
                <div class="print-signature-line">
                    Assinatura do Profissional
                </div>
            </div>
            
            <div class="print-footer">
                <p>Documento gerado em ${today} • Adriele Terapia Capilar</p>
                <p>Este documento é confidencial e destinado apenas ao uso profissional.</p>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
}

// Export print functions for global access
window.imprimirFormulario = imprimirFormulario;
window.salvarPDF = salvarPDF;
window.visualizarImpressao = visualizarImpressao;
