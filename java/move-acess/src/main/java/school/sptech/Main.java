package school.sptech;

public class Main {
    public static void main(String[] args) {
        if (args.length < 2) {
            System.err.println("Uso: java -jar ExcelImporter.jar <nome_do_bucket> <chave_do_arquivo_s3>");
            System.exit(1);
        }

        String bucketName = args[0]; // Agora é o primeiro argumento
        String fileName = args[1];   // Agora é o segundo argumento

        try {
            ConexaoComBanco conexao = new ConexaoComBanco();
            Log logService = new Log(conexao);
            ExcelImporter importer = new ExcelImporter(conexao);
            S3Service s3Service = new S3Service(bucketName); // Passamos o bucket

            // ... (resto do código)
        }catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }
}
