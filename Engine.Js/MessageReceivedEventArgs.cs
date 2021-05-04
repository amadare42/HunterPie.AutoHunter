using System;

namespace Engine.Js
{
    public class MessageReceivedEventArgs : EventArgs
    {
        public string Text { get; set; }

        public bool IsDebug { get; set; }

        public MessageReceivedEventArgs(string text, bool isDebug)
        {
            this.Text = text;
            this.IsDebug = isDebug;
        }
    }
}