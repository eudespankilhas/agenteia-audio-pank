import qrcode
import os

# URL do servidor Vite
vite_network_url = "http://192.168.0.4:5173"

# Diretório para salvar o QR Code
script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)
qr_dir = os.path.join(project_dir, 'public')
os.makedirs(qr_dir, exist_ok=True)

# Gerar QR Code
qr_img = qrcode.make(vite_network_url)

# Caminho para salvar a imagem
qr_path = os.path.join(qr_dir, 'qrcode_agente_ia_pank.png')

# Salvar imagem
qr_img.save(qr_path)

print(f'QR Code gerado com sucesso em: {qr_path}')