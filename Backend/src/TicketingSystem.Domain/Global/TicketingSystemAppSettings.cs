namespace TicketingSystem.Domain.Global
{
    public class TicketingSystemAppSettings
    {
        public string AppName { get; init; } = null!;
        public int AppPort { get; init; }
        public SmtpSettings Smtp { get; init; } = null!;
    }

    public class SmtpSettings
    {
        public string Host { get; init; } = string.Empty;
        public int Port { get; init; }
        public string UserName { get; init; } = string.Empty;
        public string Password { get; init; } = string.Empty;
        public bool EnableSsl { get; init; }
        public string SenderName { get; init; } = string.Empty;
        public string SenderEmail { get; init; } = string.Empty;
    }
}
