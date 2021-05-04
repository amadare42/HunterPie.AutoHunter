using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Windows;
using FontStyle = System.Drawing.FontStyle;

namespace Plugin.AutoHunter.Utils
{
    public class ScreenshotService
    {
        public static void Capture(string text = "")
        {
            double screenLeft = 0;
            double screenTop = 0;
            double screenWidth = SystemParameters.PrimaryScreenWidth;
            double screenHeight = SystemParameters.PrimaryScreenHeight;

            using (Bitmap bmp = new Bitmap((int)screenWidth,
                (int)screenHeight))
            {
                using (Graphics g = Graphics.FromImage(bmp))
                {
                    String filename = "ScreenCapture-" + DateTime.Now.ToString("ddMM-hhmmss-fff") + "__" + text + ".jpg";
                    g.CopyFromScreen((int)screenLeft, (int)screenTop, 0, 0, bmp.Size);
                    g.DrawString(text, new Font(FontFamily.GenericMonospace, 20, FontStyle.Bold), Brushes.White, 40, 50);
                    var dirPath = Path.Combine(Path.GetDirectoryName(typeof(ScreenshotService).Assembly.Location), "screenshots");
                    if (!Directory.Exists(dirPath))
                    {
                        Directory.CreateDirectory(dirPath);
                    }
                    var path = Path.Combine(dirPath, filename);
                    bmp.Save(path, ImageFormat.Jpeg);
                }
            }
        }
    }
}