package school.sptech;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.file.Paths;
import java.util.Properties;

public class S3Service {
    private final String bucketName;
    private final S3Client s3;

    // S3Service.java (Versão CORRIGIDA para usar IAM Role)
    public S3Service(String bucketName) {
        try (InputStream is = S3Service.class.getClassLoader().getResourceAsStream("application.properties")) {
            Properties p = new Properties();
            p.load(is);
            // String region = p.getProperty("aws.region"); // Se necessário, mas o SDK tenta adivinhar
            this.bucketName = p.getProperty("aws.bucket.name");

            s3 = S3Client.builder()
                    // O SDK VAI LER a região do ambiente ou usar o default
                    .region(Region.US_EAST_1) // Use uma região fixa ou System.getenv se precisar
                    // REMOVE: .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                    // O SDK AGORA CONFIA NO IAM ROLE DA EC2!
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao inicializar o S3", e);
        }
    }
    public String downloadFile(String key) {
        try {
            File localFile = Paths.get(System.getProperty("java.io.tmpdir"), key).toFile();

            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            try (InputStream s3Stream = s3.getObject(getObjectRequest);
                 FileOutputStream fos = new FileOutputStream(localFile)) {
                s3Stream.transferTo(fos);
            }

            System.out.println("Arquivo baixado do S3 para: " + localFile.getAbsolutePath());
            return localFile.getAbsolutePath();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao baixar arquivo do S3: " + key, e);
        }
    }
}
